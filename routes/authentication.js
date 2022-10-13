const express = require('express');
const router = express.Router();
const {
    logout,
    getSession
} = require('../controllers/authenticationController')
const passport = require('passport')


router.get('/login/federated/google', function(req,res,next){
    next();
}, passport.authenticate('google'));
router.get('/oauth2/redirect/google',
    passport.authenticate('google', {
        // successRedirect: '/api/v1/favorites/',
        failureRedirect: '/login' //redirect to an error endpoint?
        //or after the middleware check if there is a user, if there isn't return an error?
    }),
    function(req,res) {    
        //https://stackoverflow.com/a/29314111
        //redirect the parent window and then close the pop up
        //TODO - make a redirect endpoint and have this script called in a redirect component
        res.redirect("http://localhost:3000/login/redirect")
    }
);

// http://localhost:3001/api/v1/logout
router.post('/logout', logout);
router.get('/session', getSession)

module.exports = router;
