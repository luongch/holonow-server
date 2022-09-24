const NodeCache = require( "node-cache" );

const cache = new NodeCache();

const addToCache = function (video) {
    cache.set(video.id, video)
}

const existsInCache = function (videoId) {
    return cache.has(videoId)
}

module.exports = {cache, addToCache, existsInCache}