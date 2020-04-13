const express = require('express')
const request = require('request')
const fetch = require('node-fetch');

// const data = require('./data')
const munster_data_2 = require('./data/munster_data_2')

const data = munster_data_2;

const app = express()
const port = process.env.PORT || 3000

// Defining path processing function
const _processPathData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.geometry.coordinates)
        return accu;
    }, [])
    return data;
}

// Defining consumption data processing function
const _processConsumptionData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.properties.phenomenons.Consumption)
        return accu;
    }, [])
    return data;
}

// Root route
app.get('/', (req,res) => {

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
                const geometry = {
                    type: "Linestring",
                    coordinates: path
                }

                return {
                        properties: body.properties,
                        geometry
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
                            statistics: statistics.statistics
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
app.get('/consumption', (req, res) => {
    const features = []
    var counter = 0

    for (var j = 0; j < data.tracks.length; j++) {

        // url for requesting particular track
        const url = `https://envirocar.org/api/stable/tracks/${data.tracks[j].id}`

        const callback = (err, body) => {
            if (err) {
                return console.log({
                    error: err
                })
            }
            const path = _processPathData(body);

            const consumption_data = _processConsumptionData(body);

            // Processing consumption data
            for (var i = 0; i < path.length - 1; i++) {
                var consumption;
                try {
                    if (consumption_data[i + 1])
                        consumption = ((consumption_data[i].value + consumption_data[i + 1].value) / 2)
                    else
                        consumption = ((consumption_data[i - 1].value + consumption_data[i].value) / 2)
                } catch (err) {
                    consumption = -1;
                    // console.log('Error : Consumption data not available')
                }

                // Defining Color for different values of consumption data
                var color;

                if (consumption === -1)
                    color = [0, 0, 255]
                else
                    color = (consumption < 1) ? [0, 255, 0] : (consumption < 2 ? [128, 255, 0] : (consumption < 3 ? [255, 255, 0] : (consumption < 4 ? [255, 128, 0] : [255, 0, 0])));

                features.push({
                    type: "Feature",
                    properties: {
                        consumption,
                        color
                    },
                    geometry: {
                        type: "MultiLineString",
                        coordinates: [[path[i], path[i + 1]]]
                    }
                })
            }

            counter++;
            console.log("counter : ", counter)
            console.log("data.tracks.length-1 : ", data.tracks.length - 1)

            if (counter === data.tracks.length) {
                console.log("Sending response")
                res.send({
                    type: "FeatureCollection",
                    properties: { counter },
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


app.listen(port, () => {
    console.log(`Server is up at port ${port}`)
})