const youtubeHelper = require("../helpers/youtubeHelper")
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')
const {cache, addToCache, existsInCache} = require('../utils/cache')
const { performance } = require('perf_hooks');

const searchVideos = (req,res,next) => {
    let searchTerms = req.query.searchTerms
    dbHelper.search(req,res,next,searchTerms)
}
/**
 * Refreshes all live stream data and then returns all live streams
 * @param {*} req
 * @param {*} res
 */
const getLivestreams = async (req, res, next)=>{
    dbHelper.getLivestreams(req,res,next)
}

/**
 * Returns all of the latest non live videos
 */
const getAllVideos = (req, res, next) => {
    dbHelper.getAllVideos(req,res)
}

/**
 * Returns most recent archived streams
 * @param {*} req
 * @param {*} res
 */
const getArchivedVideos = (req, res, next) => {
    dbHelper.getArchivedVideos(req,res,next);
}
/**
 * Returns upcoming livestreams streams
 * @param {*} req
 * @param {*} res
 */
const getUpcomingLivestreams = (req,res, next) => {
    dbHelper.getUpcomingLiveStreams(req,res);
}
/**
 * Update the db with the latest live streaming info for each video
 * @param {*} streamingVideoList
 */
const writeToDb = (streamingVideoList) => {
    let startTime = performance.now()

    streamingVideoList.forEach(video => {
        dbHelper.addVideo(video)
    });
    let endTime = performance.now()

    console.log(`Call to write to db took ${endTime - startTime} milliseconds`)
}

/**
 * If data is outdated update all livestream data in db
 */
const refreshLiveStreams = async (req,res,next) => {
    var startTime = performance.now()

    let streamingVideoList = await youtubeHelper.getLiveStreams(refreshAll = false);

    let videoCount = await dbHelper.getVideoCount(req,res,next);
    if(videoCount == 0) { //if it is the first time getting videos
        writeToDb(streamingVideoList); 
    }
    let dateFetched = await dbHelper.getLastDateFetched(req,res,next);
    
    if(!dateFetched && !videoCount) {
        next(new Error("Couldn't get last dateFetched and videoCount"))
        return
    }
    //when running for the first time we need to check if there is any data otherwise it will not create the collection
    
    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 || videoCount === 0 ) {
        writeToDb(streamingVideoList);
        console.log("outdated")
        
    }
    else {
        console.log("fresh")
    }
    var endTime = performance.now()

    console.log(`Call to refresh livestreams took ${endTime - startTime} milliseconds`)
}

module.exports = {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams,
    refreshLiveStreams,
    searchVideos
}