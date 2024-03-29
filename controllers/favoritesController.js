const User = require('../models/user')
const Video = require('../models/video')
const mongoose = require('mongoose')

const getFavorites = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        //TODO: send proper error
        console.log("favorites controller, you are not authenticated ")
    }
    else {
        let user = await getUser(req);

        let query =  { $text : { $search : user.favorites.toString() } };

        let count = await Video.find(query)
        .countDocuments()

        let perPage = 15;
        let page = req.query.page ? req.query.page : 0;
        let results = await Video.find(query)
            .limit(perPage)
            .skip(perPage * page)
            .sort({'scheduledStartTime':-1})
            
        res.status(200).json({
            data: results,
            count
        })
    }
}

const addToFavorites = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        //TODO: send proper error
        console.log("favorites controller, you are not authenticated to add")
    }
    else {
        let user = await getUser(req);

        //check if channelId is already favorited
        if(user.favorites.includes(req.body.channelId)) {
            //TODO: send proper error
            console.log("already favorited")
        }
        else {
            user.favorites.push(req.body.channelId)
            user.save()
        }
    }

    res.status(200).json({
        data: "successfully added to faves"
    })
}

const removeFromFavorites = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        //TODO: send proper error
        console.log("favorites controller, you are not remove")
    }
    else {
        let user = await getUser(req);

        let index = user.favorites.indexOf(req.body.channelId)
        user.favorites.splice(index,1)
        user.save()
    }

    res.status(200).json({
        data: "successfully removed to faves"
    })
}

const getUser = async(req) => {
    return await User.findById(req.user.id)
}

module.exports = {
    getFavorites,
    addToFavorites,
    removeFromFavorites
}