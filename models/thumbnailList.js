const mongoose = require('mongoose')
const ThumbnailSchema = require('./thumbnail')

const ThumbnailListSchema = new mongoose.Schema({
    default: ThumbnailSchema,
    medium: ThumbnailSchema,
    high: ThumbnailSchema,
    standard: ThumbnailSchema,
    maxres: ThumbnailSchema
});

module.exports = ThumbnailListSchema