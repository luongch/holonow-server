const express = require('express');
const router = express.Router();
const {
    logout
} = require('../controllers/authenticationController')
const passport = require('passport')


router.get('/login/federated/google', function(req,res,next){
    console.log("testing")
    next();
}, passport.authenticate('google'));
router.get('/oauth2/redirect/google',
    passport.authenticate('google', {
        // successRedirect: '/api/v1/favorites/',
        failureRedirect: '/login' //redirect to an error endpoint?
        //or after the middleware check if there is a user, if there isn't return an error?
    }),
    function(req,res) {    
        //force google login page to close after login
        res.send('<script>window.close()</script>');
    }
);

// http://localhost:3001/api/v1/logout
router.post('/logout', logout);

module.exports = router;
