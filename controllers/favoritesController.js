const User = require('../models/user')
const Video = require('../models/video')

const getFavorites = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        res.status(200).json({
            data: "not authorized"
        })
    }
    else {
        let query = {"googleId": req.user.googleId}
        let user = await User.findOne({query})
        console.log(user.favorites.toString())

        query =  { $text : { $search : user.favorites.toString() } };
        Video.find(query)
            .sort({'scheduledStartTime':-1})
            .exec(function (err, results) {
                if (err) {
                    console.log("error in results")
                    next(err)
                } 
                res.status(200).json({data: results})
            }
        )
    }
    
}

const addToFavorites = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        res.status(200).json({
            data: "not authorized"
        })
    }
    else {
        let query = {"googleId": req.user.googleId}
        let user = await User.findOne({query})
        console.log("addToFavorites",req.body)

        //check if channelId is already favorited
        if(user.favorites.includes(req.body.channelId)) {
            //error this already exists
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
        res.status(200).json({
            data: "not authorized"
        })
    }
    else {
        let query = {"googleId": req.user.googleId}
        let user = await User.findOne({query})

        let index = user.favorites.indexOf(req.body.channelId)
        user.favorites.splice(index,1)
        user.save()
    }

    res.status(200).json({
        data: "successfully removed to faves"
    })
}

module.exports = {
    getFavorites,
    addToFavorites,
    removeFromFavorites
}