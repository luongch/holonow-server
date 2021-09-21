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
    app.get('/live', (req,res)=>{
        res.send(liveStreams)
    });
    app.get('/upcoming', (req,res)=>{
        res.send(upcoming)
    });
    app.listen(3000)

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

    // console.log(streamingVideoList)

    const writeToDb = (streamingVideoList) => {
        streamingVideoList.forEach(video => {
            dbHelper.upsert(video)
        });
    }
    
    let dateFetched = await dbHelper.getLastDateFetched();
    let liveStreams = null;

    if(dateFetched && moment().diff(dateFetched.dateFetched, 'minutes') > 1 ) {
        console.log("outdated, fetching new data")
        writeToDb(streamingVideoList);
        liveStreams = await dbHelper.getLiveStreams()
    }
    else {
        console.log("fresh, no need to data update")
        liveStreams = await dbHelper.getLiveStreams()
    }
    // console.log("livestreams", liveStreams)

    let upcoming = await dbHelper.getUpcomingLiveStreams();
    // console.log(upcoming);
}

main();