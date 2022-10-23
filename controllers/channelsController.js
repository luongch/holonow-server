
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const { cache, existsInCache,addToCache } = require('../utils/cache');


const User = require('../models/user')

const getChannels = (req,res,next) => {
    dbHelper.getAllChannels(req,res,next)
}

const getChannel = (req,res,next) => {
    if(existsInCache(req.params.id)) {
        let results = cache.get(req.params.id)
        console.log("it exists in the cache", results)
        res.status(200).json({data:results})
    }
    else {
        dbHelper.getChannel(req,res,next)
    }
    
}

const getFavoriteChannels = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        console.log("not authenticated")
        res.status(403).json({message: "Not Authenticated"})
    }
    else {
        let user = await User.findById(req.user.id)
        res.status(200).json({data: user.favorites})
    }
}

module.exports = {
    getChannels,
    getChannel,
    getFavoriteChannels
}