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
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/api/v1/videos/upcoming',
    // successRedirect: '/api/v1/favorites/',
    failureRedirect: '/login'
}));

// http://localhost:3001/api/v1/logout
router.post('/logout', logout);

module.exports = router;
