const getVideoList = require('../search/video-list-api')
const getVideoInfo = require('../search/video-info-api')
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')

/**
 * Refreshes all live stream data and then returns all live streams
 * @param {*} req 
 * @param {*} res 
 */
const getLiveStreams = async (req,res)=>{
    try {
        await refreshLiveStreams();
    }
    catch(error){
        res.status(500).json({success: false, msg: "failed to refresh streams"})
    }
    try {
        let liveStreams = await dbHelper.getLiveStreams()
        res.status(200).json({success: true, data: liveStreams})
    }
    catch (error) {
        res.status(500).json({success: false, msg: error})
    }    
}

/**
 * Returns all of the latest non live videos
 */
const getAllVideos = async (req, res) => {
    let videos = await dbHelper.getAllVideos()
    res.status(200).json({success: true, data: videos})
}

/**
 * Update the db with the latest live streaming info for each video
 * @param {*} streamingVideoList 
 */
const writeToDb = (streamingVideoList) => {
    streamingVideoList.forEach(video => {
        dbHelper.upsert(video)
    });
}


/**
 * If data is outdated update all livestream data in db
 */
const refreshLiveStreams = async () => {
    // get all the videos latest videos for each channel
    console.log("starting refresh")
    let videoList = await getVideoList();
    let videosInfo = await getVideoInfo(videoList);
    let streamingVideoList = [];
    //loop through all the videosInfo and combine it into a new object
    for(i = 0; i<videoList.length; i++) {
        let liveStreamingDetails = videosInfo[i].liveStreamingDetails
        if (liveStreamingDetails) {
            streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails})
        }
    }
    let dateFetched = await dbHelper.getLastDateFetched();
    let videoCount = await dbHelper.getVideoCount(); 

    //when running for the first time we need to check if there is any data otherwise it will not create the collection
    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 || videoCount === 0 ) {
        writeToDb(streamingVideoList);
        console.log("outdated")
        // res.status(200).send({success:true, message:'outdated, fetching new data'})
    }
    else {
        console.log("fresh")
        // res.status(200).send({success:true, message:'fresh, no need to data update'})
    }        
}

module.exports = {
    getLiveStreams,
    getAllVideos
}