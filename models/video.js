const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    id: {
        type: String,
        required:[true, 'must provide video id'],
        trim:true
    },
    channelId:{
        type: String,
        required:[true, 'must provide channel id'],
        trim:true
    },
    title: {
        type: String,
        required:[true, 'must video title'],
        trim:true
    },
    author: {
        type: String,
        required:[true, 'must video author'],
        trim:true
    },
    dateFetched: {
        type: Date,
        required:[true, 'must provide date data was fetched'],
        trim:true
    },
    scheduledStartTime: {
        type: Date,
        required:[true, 'must provide stream scheduled time'],
        trim:true
    },
    actualStartTime: {
        type: Date,
        required:[true, 'must provide stream start time'],
        trim:true
    },
    concurrentViewers: {
        type: Number,
        required:[true, 'must concurrent viewers'],
        trim:true
    },
    activeLiveChatId: {
        type: String,
        required:[true, 'must active live chat id'],
        trim:true
    },
})

module.exports = mongoose.model('Video', videoSchema)