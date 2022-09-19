require('dotenv').config();
const channels = require('../channel_ids.json');
// const channels = require('../channel_ids copy.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const moment = require('moment')
const {google} = require('googleapis');

/**
 * Given a list of video ids, calls Youtube api to get all the livestreaming details for each video
 * @param {*} videoList 
 * @returns array of video info
 */
const getVideoInfo = async (videoList) => {
    let videoIdList = getVideoIds(videoList)
    let chunkedVideoIdList = chunkArray(videoIdList)
    
    let videoInfo = [];
    
    for(const chunkedList of chunkedVideoIdList) {
        let info = await google.youtube('v3').videos.list({
            key: process.env.YOUTUBE_TOKEN,
            part: 'liveStreamingDetails, snippet',
            id: chunkedList
            });
        videoInfo.push.apply(videoInfo, info.data.items);
    }    
    return videoInfo;
};

/**
 * Gets all video ids from a list of videos
 * @param {*} videoList 
 * @returns List of video ids
 */
const getVideoIds = (videoList) => {
    let videoIdList = []
    videoList.forEach(video => {
        videoIdList.push(video.id)
    });

    return videoIdList;
}

/**
 * Chunk the video list into chunks of 50
 * Youtube only allows 50 results per request
 * @param {*} videoIdList 
 * @returns Array with smalled chunked arrays
 */
const chunkArray = (videoIdList) => {
    let chunk = 50;
    let chunkedVideoIdList = [];
    for (let i = 0; i<videoIdList.length; i+= chunk) {
        chunkedVideoIdList.push(videoIdList.slice(i, i + chunk));
    }
    return chunkedVideoIdList;
}


/**
 * Given a string of xml data, parse it and return the first(latest) video in the feed
 */
const extractVideoData = (data) =>{
  let video = {}; 
  parseString(data, function (err, result) {
    if(typeof result.feed.entry !== "undefined") { //validation for channels with no videos
      video = {
        id: result.feed.entry[0]['yt:videoId'][0],
        channelId: result.feed.entry[0]['yt:channelId'][0],
        title: result.feed.entry[0].title[0],
        author: result.feed.entry[0].author[0].name[0]
      }
    }
  });
  return video;
}

/**
 * Calls youtube's video xml feed and gets a list of all videos per channel
 * @returns A filtered list of videos from all channels
 */
const getVideoList = async() => {
  const xmlFetches = channels.map((channel) => (
    axios.get('https://www.youtube.com/feeds/videos.xml', {
      params: {
        channel_id: channel.id,
        t: moment(),
      },
    })
    .then((xmlResult) => {
      return extractVideoData(xmlResult.data)
    })
    .catch((error)=>{
        console.log(error)
    })
  ));
  
  let videoList = (await Promise.all(xmlFetches)).flat();
  return videoList.filter(videos => Object.keys(videos).length !== 0 ); //we need to filter out any empty objects that result from channels with no videos
};

module.exports = {getVideoInfo,getVideoList}