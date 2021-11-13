const getVideoList = require('../search/video-list-api')
const getVideoInfo = require('../search/video-info-api')
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')

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

const getAllVideos = async (req, res) => {
    let videos = await dbHelper.getAllVideos()
    res.status(200).json({success: true, data: videos})
}

const refreshLiveStreams = async () => {
    // get all the videos latest videos for each channel
    console.log("starting refresh")
    let videoList = await getVideoList();
    let videosInfo = await getVideoInfo(videoList);

    let streamingVideoList = [];
    //loop through all the videosInfo and combine it into a new object
    for(i = 0; i<videoList.length; i++) {
        let liveStreamingDetails = videosInfo.data.items[i].liveStreamingDetails
        if (liveStreamingDetails) {
            streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails})
        }
    }

    const writeToDb = (streamingVideoList) => {
        streamingVideoList.forEach(video => {
            dbHelper.upsert(video)
        });
    }
    
    let dateFetched = await dbHelper.getLastDateFetched();
    
    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 ) {
        writeToDb(streamingVideoList);
        console.log("outdated")
        // res.status(200).send({success:true, message:'outdated, fetching new data'})
    }
    else {
        console.log("fresh")
        // res.status(200).send({success:true, message:'fresh, no need to data update'})
    }        
    // res.status(400).send({success:false, message:"failed to refresh data"})
}

module.exports = {
    getLiveStreams,
    // getAllVideos
}