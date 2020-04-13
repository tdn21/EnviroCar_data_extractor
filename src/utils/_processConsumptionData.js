// Defining consumption data processing function
const _processConsumptionData = (initial_data) => {
    const data = initial_data.features.reduce((accu, curr) => {
        accu.push(curr.properties.phenomenons.Consumption)
        return accu;
    }, [])
    return data;
}

module.exports = _processConsumptionData;