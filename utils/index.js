const request = require('request');
const data = require('./data');

const _processPathData = (initial_data) => {

    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.geometry.coordinates)
        return accu;
    }, [])
    return data;
}

const get_features_data = (data) => {

    const features = []
    var counter = 0;

    for(var i=0; i<data.tracks.length; i++) {

        // url for requesting particular track
        const url = `https://envirocar.org/api/stable/tracks/${data.tracks[i].id}`

        const callback = (err, body) => {
            if(err) {
                return console.log({
                    error: err
                })
            }

            path= _processPathData(body);

            features.push({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: path
                },
                properties: body.properties
            })
            counter++;
            console.log("counter : ", counter)
            console.log("data.tracks.length-1 : ", data.tracks.length-1)

            if(counter===data.tracks.length-1) {
                console.log("final features data : ", features)
            }
        }

        request({ url, json: true }, (err, res) => {
            if (err) {
                callback('Unable to connect to EnviroCar API', undefined);
            }
            else if (res.body.features.length === 0) {
                callback('Unable to get track', undefined);
            }
            else {
                // console.log('res.body : ', res.body)
                callback(undefined, res.body);
            }
        })
    }
}

get_features_data(data);