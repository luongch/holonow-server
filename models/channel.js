const mongoose = require('mongoose')
const ThumbnailSchema = require('./thumbnail')

const channelSchema = new mongoose.Schema({
    id: {
        type: String,
        required:[true, 'must provide channel id']
    },
    title: {
        type: String,
        required:[true, 'must provide channel title']
    },
    subscribers: {
        type: Number,
        required:[true, 'must provide subscriber count']
    },
    playlistId: {
        type: String,
        required:[true, 'must provide upload playlist id']
    },
    thumbnail: ThumbnailSchema
})

module.exports = mongoose.model('Channel', channelSchema)