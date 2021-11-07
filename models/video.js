const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    id: String,
    channelId: String,
    title: String,
    author: String,
    dateFetched: Date,
    scheduledStartTime: Date,
    actualStartTime: Date,
    concurrentViewers: Number,
    activeLiveChatId: String
})

module.exports = mongoose.model('Video', videoSchema)