const mongoose = require('mongoose')
const moment = require('moment')
const videoSchema = new mongoose.Schema({
    id: {
        type: String,
        required:[true, 'must provide video id']
    },
    channelId:{
        type: String,
        required:[true, 'must provide channel id']
    },
    title: {
        type: String,
        required:[true, 'must provide video title']
    },
    author: {
        type: String,
        required:[true, 'must provide video author']
    },
    dateFetched: {
        type: Date,
        required:[true, 'must provide date data was fetched'],
        default: moment()
    },
    scheduledStartTime: {
        type: Date,
        required:[true, 'must provide stream scheduled time']
    },
    actualStartTime: {
        type: Date,
        required:[true, 'must provide stream start time']
    },
    concurrentViewers: {
        type: Number,
        required:[true, 'must provide concurrent viewers']
    },
    activeLiveChatId: {
        type: String,
        required:[true, 'must provide active live chat id']
    },
})

module.exports = mongoose.model('Video', videoSchema)