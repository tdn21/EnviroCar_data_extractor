const express = require('express');
const router = require('./routers/tracks');


const app = express();
const port = process.env.PORT || 3000;


app.use(router);


app.listen(port, () => {
    console.log(`Server is up at port ${port}`)
})