const express = require('express');
const videoRoutes = require('../routes/videos')
const authRoutes = require('../routes/authentication')
const favRoutes = require('../routes/favorites')
const channelsRoutes = require('../routes/channels')
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

var createError = require('http-errors');

require('./passport')
var session = require('express-session');
const passport = require('passport')

const connectDb = require('../helpers/connectDb');
const {setupHelper} = require('../helpers/setupHelper')

const createServer = function() {
    
    const app = express();
    connectDb(process.env.MONGO_URL)
    
    app.use(express.json()); //this is needed in order to parse data from req.body
    let corsOptions = {
      origin: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://localhost:3000":"https://holonow.netlify.app",
      credentials: true
    }
    app.use(cors(corsOptions))
    
    app.set("trust proxy", 1)

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
      app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
      }));
    } else {
        // production code
        app.use( session({
          secret: "secretcode",
          resave: true,
          saveUninitialized: true,
          cookie: {
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
          }
        }));
    }
    
    
    
    // app.use(passport.authenticate('session'));
    app.use(passport.initialize());
    app.use(passport.session());

      
    
    app.use('/api/v1/videos', videoRoutes)
    app.use('/api/v1/', authRoutes)
    app.use('/api/v1/favorites', favRoutes)
    app.use('/api/v1/channels', channelsRoutes)

    setupHelper()

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });

    return app
}

module.exports = createServer