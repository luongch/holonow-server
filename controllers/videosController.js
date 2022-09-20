const youtubeHelper = require("../helpers/youtubeHelper")
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')

/**
 * Refreshes all live stream data and then returns all live streams
 * @param {*} req 
 * @param {*} res 
 */
const getLivestreams = async (req, res, next)=>{
    // try {
    //     console.log("before getLivestreams")
        dbHelper.getLivestreams(req,res,next)
    // }
    // catch (error) {
    //     res.status(500).json({success: false, msg: error})
    // }    
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
    streamingVideoList.forEach(video => {
        dbHelper.upsert(video,next)
    });
}

/**
 * If data is outdated update all livestream data in db
 */
const refreshLiveStreams = async (req,res,next) => {
    // get all the videos latest videos for each channel
    console.log("starting refresh")
    let videoList = await youtubeHelper.getVideoList();
    let videosInfo = await youtubeHelper.getVideoInfo(videoList);
    let streamingVideoList = [];
    //loop through all the videosInfo and combine it into a new object
    for(i = 0; i<videoList.length; i++) {
        let liveStreamingDetails = videosInfo[i].liveStreamingDetails
        let thumbnailDetails = {
            thumbnails: videosInfo[i].snippet.thumbnails
        }; 
        if (liveStreamingDetails) {
            streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails, ...thumbnailDetails})
        }
    }
    let dateFetched = await dbHelper.getLastDateFetched(req,res,next);
    let videoCount = await dbHelper.getVideoCount(req,res,next); 
    
    if(!dateFetched && !videoCount) {
        next(new Error("Couldn't get last dateFetched or videoCount"))
        return
    }
    //when running for the first time we need to check if there is any data otherwise it will not create the collection
    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 || videoCount === 0 ) {
        writeToDb(req,res,next,streamingVideoList);
        console.log("outdated")
        // res.status(200).send({success:true, message:'outdated, fetching new data'})
    }
    else {
        console.log("fresh")
        // res.status(200).send({success:true, message:'fresh, no need to data update'})
    }        
}

module.exports = {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams,
    refreshLiveStreams
}