const express = require('express');
const router = express.Router();
const {
    logout
} = require('../controllers/authenticationController')
const passport = require('passport')


router.get('/login/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/api/v1/favorites/',
    failureRedirect: '/login'
}));

// http://localhost:3001/api/v1/logout
router.post('/logout', logout);

module.exports = router;
