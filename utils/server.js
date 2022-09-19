const express = require('express');
const videos = require('../routes/videos')
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URL

const connectDb = require('../helpers/connectDb');

const createServer = function(mongoDbUri) {
    
    const app = express();
    connectDb(url)
    
    app.use('/api/v1/videos', videos)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        console.log("caught 404")
        console.log(res)
        next(createError(404));
    });

    return app
}


module.exports = createServer