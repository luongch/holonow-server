const videoListApi = require('../search/video-list-api')
const videoInfoApi = require('../search/video-info-api')
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')

const getLiveStreams = async (req,res)=>{
    liveStreams = await dbHelper.getLiveStreams()
    res.status(200).json({success: true, data:liveStreams})
}

const refreshLiveStreams = async (req, res) => {
    // get all the videos latest videos for each channel
    let videoList = await videoListApi();
    let videosInfo = await videoInfoApi(videoList);

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
        res.status(200).send({success:true,  message:'outdated, fetching new data'})
    }
    else {
        res.status(200).send({success:true, message:'fresh, no need to data update'})
    }        
    res.status(400).send({success:false, message:"failed to refresh data"})
}

module.exports = {
    getLiveStreams,
    refreshLiveStreams
}