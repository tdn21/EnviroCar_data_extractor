const munster_data_2 = require('./data/munster_data_2');

const data = munster_data_2;

console.log("tracks array length : ", data.tracks.length)

const getDates = (data) => {
    const date_array = data.tracks.map(track => {
        const begin = new Date(track.begin);
        const month = begin.getMonth();

        return month;
    })
    return date_array;
} 

const date_array = getDates(data);

// console.log("date array : ",date_array);

const final_data = [
    {x: '1', y: date_array.lastIndexOf(10)-date_array.indexOf(10)+1},
    {x: '2', y: date_array.lastIndexOf(11)-date_array.indexOf(11)+1},
    {x: '3', y: date_array.lastIndexOf(0)-date_array.indexOf(0)+1},
    {x: '4', y: date_array.lastIndexOf(1)-date_array.indexOf(1)+1},
    {x: '5', y: date_array.lastIndexOf(2)-date_array.indexOf(2)+1},
]

console.log("final_data : ", final_data)