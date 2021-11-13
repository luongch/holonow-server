const axios = require('axios');
const {google} = require('googleapis');

const getVideoInfo = async (videoList) => {
    // loop through list of videos to do a batch call to videos api
    let videoIdList = [];
    videoList.forEach(video => {
        videoIdList.push(video.id)
    });
    
    let promise = google.youtube('v3').videos.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'liveStreamingDetails',
        id: videoIdList
    })
    
    return promise;
};

module.exports = getVideoInfo