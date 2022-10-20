const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user')

//http://localhost:3001/api/v1/login/federated/google
let callbackUrl = ''
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    callbackUrl='/api/v1/oauth2/redirect/google'
} else {
    // production code
    callbackUrl='https://holonowapi.onrender.com/api/v1/oauth2/redirect/google'
}

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/oauth2/redirect/google',
    }, function verify(_, __, profile, done) {
        console.log("passport callback function fired")
        let query = {'googleId': profile.id};
        User.findOne(query, async function(err, user){
            if(err) {
                return done(err, null)
            }
            if(!user) {
                console.log("add new user to db")
                let user = {
                    username: profile.displayName,
                    googleId: profile.id,
                    name: profile.name
                }
                let newUser = new User(user)
                await newUser.save()
                done(null,newUser)
            }
            else {
                console.log("this user already exists")
                done(null,user)
            }
        })
    })
)
passport.serializeUser(function(user, done) {
    console.log("serializeUser")
    return done(null, user._id);
    // process.nextTick(function() {
    //     console.log("in process.nextTick")
    //   cb(null, { id: user.id, username: user.username, name:user.name });
    // });
  });
  
passport.deserializeUser(function(id, done) {
    console.log("deserializeUser", id)
    User.findById(id, (err, doc) => {
        // Whatever we return goes to the client and binds to the req.user property
        return done(null, doc);
    })
    // process.nextTick(function() {
    //     return cb(null, user);
    // });
});