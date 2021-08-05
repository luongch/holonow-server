const videoListApi = require('./search/video-list-api')
const videoInfoApi = require('./search/video-info-api')
const express = require('express')
const app = express();

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

    let videoInfo = await videoInfoApi(videoList);
    console.log("videoInfo", videoInfo.data.items)
    //do a batch request for each videoId and determine if it is live/upcoming or not

}

main();