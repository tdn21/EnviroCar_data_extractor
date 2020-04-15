// Defining consumption data processing function
const _processConsumptionData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.properties.phenomenons.Consumption)
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

module.exports = _processConsumptionData;