
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

module.exports = getVideoInfo