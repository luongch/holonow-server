const youtubeHelper = require("../helpers/youtubeHelper")
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();


const authenticate = (req,res,next) => {
    console.log("logging in")
    console.log("done logging in")
}

const logout = (req,res,next) => {
    console.log("logging out")
}

module.exports = {
    authenticate,
    logout
}