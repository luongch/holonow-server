const youtubeHelper = require("../helpers/youtubeHelper")
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')
const {cache, addToCache, existsInCache} = require('../utils/cache')
const { performance } = require('perf_hooks');

const searchVideos = (req,res,next) => {
    console.log("searching")    
    let match = "Kiara HoloCure"
    dbHelper.search(req,res,next,match)

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
const writeToDb = (req,res,next,streamingVideoList) => {
    let startTime = performance.now()

    streamingVideoList.forEach(video => {
        // dbHelper.upsert(video,next)
        dbHelper.addVideo(video,next)
    });
    let endTime = performance.now()

    console.log(`Call to write to db took ${endTime - startTime} milliseconds`)
}

/**
 * If data is outdated update all livestream data in db
 */
const refreshLiveStreams = async (req,res,next) => {
    var startTime = performance.now()

    // get all the videos latest videos for each channel
    console.log("starting refresh")
    let videoList = await youtubeHelper.getVideoList();
    let videosInfo = await youtubeHelper.getVideoInfo(videoList);
    let streamingVideoList = [];
    //loop through all the videosInfo and combine it into a new object
    for(let i = videosInfo.length-1; i >= 0; i--) {
        let liveStreamingDetails = videosInfo[i].liveStreamingDetails
        let thumbnailDetails = {
            thumbnails: videosInfo[i].snippet.thumbnails
        };
        //&& !existsInCache(videosInfo[i].id)
        if (liveStreamingDetails ) {
            streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails, ...thumbnailDetails})
            addToCache(videosInfo[i])
        }
    }

    let videoCount = await dbHelper.getVideoCount(req,res,next);
    if(videoCount == 0) { //if it is the first time getting videos
        writeToDb(req,res,next,streamingVideoList); 
    }
    let dateFetched = await dbHelper.getLastDateFetched(req,res,next);
    
    if(!dateFetched && !videoCount) {
        next(new Error("Couldn't get last dateFetched and videoCount"))
        return
    }
    //when running for the first time we need to check if there is any data otherwise it will not create the collection
    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 || videoCount === 0 ) {
        // console.log(streamingVideoList)
        console.log("outdated")
        writeToDb(req,res,next,streamingVideoList);        
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