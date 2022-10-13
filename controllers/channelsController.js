
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();

const getChannels = (req,res,next) => {
    dbHelper.getAllChannels(req,res,next)
}

const getChannel = (req,res,next) => {
    dbHelper.getChannel(req,res,next)
}

module.exports = {
    getChannels,
    getChannel
}