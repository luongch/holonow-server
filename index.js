const express = require('express');
const app = express();
const videos = require('./routes/videos')
const connectDb = require('./helpers/connectDb');
var url = process.env.MONGO_URL

app.use('/api/v1/videos', videos)

const start = async () => {
    try {
        await connectDb(url)
        app.listen(process.env.PORT || 3001, ()=> {
            console.log(`Server is listening on port ${process.env.PORT || 3001}....`)
        }) 
    }
    catch (error) {
        console.log(error)
    }
}

start();
 
