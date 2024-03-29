const express = require('express');
const router = express.Router();
const {
    logout,
    getSession
} = require('../controllers/authenticationController')
const passport = require('passport')
const dotenv = require('dotenv');
dotenv.config();

router.get('/login/federated/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/oauth2/redirect/google',
    passport.authenticate('google', {
        // successRedirect: '/api/v1/favorites/',
        failureRedirect: '/api/v1/health', //redirect to an error endpoint?
        session:true
        //or after the middleware check if there is a user, if there isn't return an error?
    }),
    function(req,res) {    
        //https://stackoverflow.com/a/29314111
        //redirect the parent window and then close the pop up
        //TODO - make a redirect endpoint and have this script called in a redirect component
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            res.redirect("http://localhost:3000/login")
        } else {
            // production code
            res.redirect("https://holonow.netlify.app/login")
        }
        
    }
);

// http://localhost:3001/api/v1/logout
router.get('/logout', logout);
router.get('/session', getSession)
router.get('/health', function(req,res,next){
    res.status(200).json({
        data: 'ok'
    })
})

module.exports = router;
