const NodeCache = require( "node-cache" );

const cache = new NodeCache();

const addToCache = function (data) {
    console.log("trying to add ", data)
    cache.set(data.id, data)
}

const existsInCache = function (id) {
    return cache.has(id)
}

module.exports = {cache, addToCache, existsInCache}