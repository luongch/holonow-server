require('dotenv').config();
const channels = require('../channel_ids.json');
// const channels = require('../channel_ids copy.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const {google} = require('googleapis');
const { cache, existsInCache,addToCache } = require('../utils/cache');
const { performance } = require('perf_hooks');

/**
 * 
 */
const getChannelInfo = async () => {
  console.log("getting channel info")
  
  let channelIds  = channels.map(channel => {
    return channel.id
  })

  let chunkedChannelList = chunkArray(channelIds)

  let channelInfo = [];
  for(let chunkedChannels of chunkedChannelList) {
    let info = await google.youtube('v3').channels.list({
      key: process.env.YOUTUBE_TOKEN,    
      id: chunkedChannels.toString(), //id must start before part
      part: "snippet,contentDetails,statistics",
    })
    channelInfo.push.apply(channelInfo, info.data.items)
  }
  return channelInfo;
}

/**
 * Given a list of video ids, calls Youtube api to get all the livestreaming details for each video
 * @param {*} videoList 
 * @returns array of video info
 */
const getVideoInfo = async (videoList) => {
  let startTime = performance.now()

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
  let endTime = performance.now()

  console.log(`Call to youtube API took ${endTime - startTime} milliseconds`)
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
const extractVideoData = (data, videoList, refreshAll=true) =>{    
  parseString(data, function (err, result) {
    if(typeof result.feed.entry !== "undefined") { //validation for channels with no videos
      let numVideosToExtract = refreshAll ? result.feed.entry.length : 2
      console.log("numVideosToExtract", numVideosToExtract)
      for(let i = 0; i<numVideosToExtract; i++) { //only get the first two because sometimes the first video isn't the livestream
        let video = {
          id: result.feed.entry[i]['yt:videoId'][0],
          channelId: result.feed.entry[i]['yt:channelId'][0],
          title: result.feed.entry[i].title[0],
          author: result.feed.entry[i].author[0].name[0]
        }
        videoList.push(video)
      }      
    }
  });
}

/**
 * Calls youtube's video xml feed and gets a list of all videos per channel
 * @returns A filtered list of videos from all channels
 */
const getVideoList = async(refreshAll) => {
  let startTime = performance.now()

  let videoList = [];
  const xmlFetches = channels.map((channel) => (
    axios.get('https://www.youtube.com/feeds/videos.xml', {
      params: {
        channel_id: channel.id,
        
      },
    })
    .then((xmlResult) => {
      extractVideoData(xmlResult.data, videoList,refreshAll)
    })
    .catch((error)=>{
        console.log(error)
    })
  ));
  
  await Promise.all(xmlFetches);
  //for each channel filter out any that have no videos
  let endTime = performance.now()

  console.log(`Call to get XML data took ${endTime - startTime} milliseconds`)
  return videoList.filter(videos => Object.keys(videos).length !== 0 ); //we need to filter out any empty objects that result from channels with no videos
};

const getLiveStreams = async(refreshAll = true) => {
  console.log("starting refresh")
  let videoList = await getVideoList(refreshAll);
  let videosInfo = await getVideoInfo(videoList);
  let streamingVideoList = [];
  //loop through all the videosInfo and combine it into a new object
  for(let i = videosInfo.length-1; i >= 0; i--) {
      let liveStreamingDetails = videosInfo[i].liveStreamingDetails
      let thumbnailDetails = {
          thumbnails: videosInfo[i].snippet.thumbnails
      };
      //&& !existsInCache(videosInfo[i].id)
      if (liveStreamingDetails ) {
          streamingVideoList.push({ ...videoList[i], ...liveStreamingDetails, ...thumbnailDetails})
          addToCache(videosInfo[i])
      }
  }

  return streamingVideoList

}

module.exports = {getVideoInfo,getVideoList,getChannelInfo, getLiveStreams}