const express = require('express');
const fetch = require('node-fetch');
const request = require('request');

const _processPathData = require('../utils/_processPathData');
const _processConsumptionData = require('../utils/_processConsumptionData');
const _processSpeedData = require('../utils/_processSpeedData');
const munster_data = require('../utils/data/munster_data');

const router = new express.Router()

const data = munster_data;

// Root route
router.get('/', (req,res) => {

    const features = [];
    var counter = 0;

    for(var i = 0; i < data.tracks.length; i++) {

        // url's for requesting particular track and its statistics
        const track_url = `https://envirocar.org/api/stable/tracks/${data.tracks[i].id}`;
        const stats_url = `https://envirocar.org/api/stable/tracks/${data.tracks[i].id}/statistics`;

        fetch(track_url).
            then(res => res.json()).
            then(body => {
                const path = _processPathData(body);
                const consumption_data = _processConsumptionData(body);
                const speed_data = _processSpeedData(body);
                const geometry = {
                    type: "Linestring",
                    coordinates: path
                }

                return {
                        properties: body.properties,
                        geometry,
                        consumption_data,
                        speed_data
                    };
            }).
            then(track_data => {
                fetch(stats_url).
                    then(res => res.json()).
                    then(statistics => {
                        features.push({
                            type: "Feature",
                            properties: track_data.properties,
                            geometry: track_data.geometry,
                            statistics: statistics.statistics,
                            consumption: track_data.consumption_data,
                            speed: track_data.speed_data
                        })
                    }).
                    then(()=>{
                        counter++;
                        console.log("Tracks left to process : ",100-counter);
                    }).
                    then(()=> {
                        if(counter === 100) {
                            console.log("Response Successfully Sent!!")
                            res.send({
                                type: "FeatureCollection",
                                properties: {},
                                features
                            })
                        }
                    })
            }).
            catch(err => {
                console.log("Unable to proccess request to / route!");
                console.log();
                console.log(err);

                res.status(400).send('Unable to process request!');
            })
    }
})


// Consumption route
router.get('/consumption', (req, res) => {
    const features=[];
    var counter=0;

    for(var j=0 ;j < data.tracks.length; j++) {

        // url
        const url = `https://envirocar.org/api/stable/tracks/${data.tracks[j].id}`

        const callback = (err, body) => {
            if (err) {
                return console.log({
                    "Error" : err
                })
            }

            const path = _processPathData(body)
            const consumption_data = _processConsumptionData(body)
            
            features.push({
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Linestring",
                    coordinates: path
                },
                consumption: consumption_data
            })
            counter++;
            console.log("Counter : ", counter);

            if(counter === data.tracks.length) {
                console.log("Sending response")
                res.send({
                    type: "FeatureCollection",
                    properties: {},
                    features
                })
            }
        }

        request({ url, json: true }, (err, res) => {
            if (err) {
                callback(err, undefined);
            }
            else if (res.body.features.length === 0) {
                callback('Unable to get track', undefined);
            }
            else {
                callback(undefined, res.body);
            }
        })
    }
})


module.exports = router;