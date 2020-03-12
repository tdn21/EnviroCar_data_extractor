const data = require('./data');

console.log("tracks array length : ", data.tracks.length)

const getDates = (data) => {
    const date_array = data.tracks.map(track => {
        const begin = new Date(track.begin)
        const date = begin.getDate();
        return date;
    })
    return date_array;
} 

const date_array = getDates(data);

const final_data = [
    {x: '20', y: date_array.lastIndexOf(20)-date_array.indexOf(20)+1},
    {x: '21', y: date_array.lastIndexOf(21)-date_array.indexOf(21)+1},
    {x: '22', y: date_array.lastIndexOf(22)-date_array.indexOf(22)+1},
    {x: '23', y: date_array.lastIndexOf(23)-date_array.indexOf(23)+1},
    {x: '24', y: date_array.lastIndexOf(24)-date_array.indexOf(24)+1},
    {x: '25', y: date_array.lastIndexOf(25)-date_array.indexOf(25)+1},
    {x: '26', y: date_array.lastIndexOf(26)-date_array.indexOf(26)+1},
    {x: '27', y: date_array.lastIndexOf(27)-date_array.indexOf(27)+1},
    {x: '28', y: date_array.lastIndexOf(28)-date_array.indexOf(28)+1},
    {x: '29', y: date_array.lastIndexOf(29)-date_array.indexOf(29)+1},
    {x: '1', y: date_array.lastIndexOf(1)-date_array.indexOf(1)+1},
    {x: '2', y: date_array.lastIndexOf(2)-date_array.indexOf(2)+1},
    {x: '3', y: date_array.lastIndexOf(3)-date_array.indexOf(3)+1},
    {x: '4', y: date_array.lastIndexOf(4)-date_array.indexOf(4)+1},
    {x: '5', y: date_array.lastIndexOf(5)-date_array.indexOf(5)+1},
    {x: '6', y: date_array.lastIndexOf(6)-date_array.indexOf(6)+1},
]

console.log("final_data : ", final_data)