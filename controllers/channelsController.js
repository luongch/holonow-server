
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();

const User = require('../models/user')

const getChannels = (req,res,next) => {
    dbHelper.getAllChannels(req,res,next)
}

const getChannel = (req,res,next) => {
    dbHelper.getChannel(req,res,next)
}

const getFavoriteChannels = async (req,res,next) => {
    if(!req.isAuthenticated()) {
        console.log("not authenticated")
        //redirect to login page?
        //or just show the login button in front end
    }
    else {
        let query = {"googleId": req.user.googleId}
        let user = await User.findOne({query})
        res.status(200).json({data: user.favorites})
    }
}

module.exports = {
    getChannels,
    getChannel,
    getFavoriteChannels
}