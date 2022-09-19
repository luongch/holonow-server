const mongoose = require('mongoose')
const ThumbnailSchema = new mongoose.Schema({
    url: {
        type: String,
        required:[true, 'must provide thumbnail url']
    },
    width: {
        type: Number,
        required:[true, 'must provide thumbnail width']
    },
    height: {
        type: Number,
        required:[true, 'must provide thumbnail height']
    }
});

module.exports = ThumbnailSchema