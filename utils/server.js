const express = require('express');
const videoRoutes = require('../routes/videos')
const authRoutes = require('../routes/authentication')
const favRoutes = require('../routes/favorites')
require('./passport')
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGO_URL
var createError = require('http-errors');
var session = require('express-session');
const passport = require('passport')

const connectDb = require('../helpers/connectDb');

const createServer = function(mongoDbUri) {
    
    const app = express();

    app.use(express.json()); //this is needed in order to parse data from req.body
    
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
      }));
    app.use(passport.authenticate('session'));

    app.use(function(req, res, next) {
        res.locals.currentUser = req.user;
        next();
      });
      
    connectDb(url)
    app.use('/api/v1/videos', videoRoutes)
    app.use('/api/v1/', authRoutes)
    app.use('/api/v1/favorites', favRoutes)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    return app
}


module.exports = createServer