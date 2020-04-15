// Defining Speed data processing function

const _processSpeedData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.properties.phenomenons.Speed)
        return accu;
    }, [])
    const final_data = data.map(d => {
        if(d && d.value) {
            return d.value;
        }
        else return -1;
    })
    return final_data;
}

module.exports = _processSpeedData;