const express = require('express')
const app = express();
const videoListApi = require('./search/video-list-api')
const videoInfoApi = require('./search/video-info-api')
const videoModel = require('./models/video')
const DbHelper = require('./helpers/dbHelper')
const dbHelper = new DbHelper();
const moment = require('moment')

const main = async() => {
    app.get('/', (req,res)=>{
        res.send('we are on home')
    });
    app.get('/videoList', (req,res)=>{
        res.send(videoList)
    });
    app.get('/videoInfo', (req,res)=>{
        res.send(videoInfo.data.items)
    });
    app.listen(3000)

    // get all the videos latest videos for each channel    
    let videoList = await videoListApi();        
    let videosInfo = await videoInfoApi(videoList);

    let streamingVideoList = [];
    //loop through all the videosInfo and combine it into a new object
    for(i = 0; i<videoList.length; i++) {
        //check if it is a video is live or scheduled to be live in the future
        let liveStreamingDetails = videosInfo.data.items[i].liveStreamingDetails
        if (liveStreamingDetails && liveStreamingDetails.scheduledStartTime && !liveStreamingDetails.actualEndTime) {
            streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails})
        }
    }

    // console.log(streamingVideoList)

    const writeToDb = (streamingVideoList) => {
        streamingVideoList.forEach(video => {
            dbHelper.upsert(video)
        });
    }
    // writeToDb(streamingVideoList);
    
    // dbHelper.getLiveStreams()
    // dbHelper.getAllVideos()
    
    let dateFetched = await dbHelper.getLastDateFetched();
    let liveStreams = null;

    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 5 ) {
        console.log("outdated")
        writeToDb(streamingVideoList);
        liveStreams = await dbHelper.getLiveStreams()
    }
    else {
        console.log("fresh")
        liveStreams = await dbHelper.getLiveStreams()
    }
    console.log("livestreams", liveStreams)
    

    //make method to check when the last update was

    //make it so it will only writeToDb when the last update was 5 minutes ago
}

main();