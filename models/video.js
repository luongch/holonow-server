const mongoose = require('mongoose')
const moment = require('moment')

const ThumbnailListSchema = require('./thumbnailList')
//https://stackoverflow.com/a/39597985

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
    liveBroadcastContent: {
        type: String,
        required:[true, 'must provide liveBroadcastContent type']
    },
    concurrentViewers: {
        type: Number,
        // required:[true, 'must provide concurrent viewers']
    },
    activeLiveChatId: {
        type: String,
        // required:[true, 'must provide active live chat id']
    },
    thumbnails: ThumbnailListSchema
});

videoSchema.index({ title: 'text', author: 'text', channelId: 'text' });
// https://stackoverflow.com/questions/24714166/full-text-search-with-weight-in-mongoose
// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/text/

module.exports = mongoose.model('Video', videoSchema)