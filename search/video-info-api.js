const axios = require('axios');
const parseString = require('xml2js').parseString;
const {google} = require('googleapis');

module.exports = async (videoList) => {
    console.log('video info api start');
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