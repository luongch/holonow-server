const mongoose = require('mongoose')
nameSchema = new mongoose.Schema({
    familyName: {
        type: String,
        required:true
    },
    givenName: {
        type: String,
        required:true
    }
})
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true, 'must provide username']
    },
    googleId: {
        type: Number,
        required:[true, 'must provide googleId']
    },
    name: nameSchema,
    favorites: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema)