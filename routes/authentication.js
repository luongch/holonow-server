const express = require('express');
const router = express.Router();
const {
    authenticate,
    logout
} = require('../controllers/authenticationController')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user')

//http://localhost:3001/api/v1/login/federated/google
passport.use(
    new GoogleStrategy({
        callbackURL: '/api/v1/oauth2/redirect/google',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        scope: [ 'profile' ]
    }, function verify(issuer, profile, cb) {
        console.log("passport callback function fired")
        let query = {'googleId': profile.id};
        User.findOne(query, function(err, user){
            if(err) {
                return cb(err)
            }
            if(!user) {
                console.log("add new user to db")
                let user = {
                    username: profile.displayName,
                    googleId: profile.id,
                    name: profile.name
                }
                new User(user).save()
                return cb(null,user)
            }
            else {
                console.log("this user already exists")
                return cb(null,user)
            }
        })
    })
)
passport.serializeUser(function(user, cb) {
    console.log("serializeUser")
    console.log(user)
    process.nextTick(function() {
        console.log("in process.nextTick")
      cb(null, { id: user.id, username: user.username, name:user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    console.log("deserializeUser")
    process.nextTick(function() {
      return cb(null, user);
    });
  });


router.get('/login/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/api/v1/videos/upcoming',
    failureRedirect: '/login'
}));

// http://localhost:3001/api/v1/logout
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        console.log("successfully logged out")
        res.redirect("/api/v1/videos/archived")
    });
});

module.exports = router;
