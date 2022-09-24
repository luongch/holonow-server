const express = require('express');
const videos = require('../routes/videos')
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URL
var createError = require('http-errors');

const connectDb = require('../helpers/connectDb');

const createServer = function(mongoDbUri) {
    
    const app = express();
    connectDb(url)
    app.use('/api/v1/videos', videos)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    return app
}


module.exports = createServer