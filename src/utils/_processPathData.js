// Defining path processing function
const _processPathData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.geometry.coordinates)
        return accu;
    }, [])
    return data;
}

module.exports = _processPathData;