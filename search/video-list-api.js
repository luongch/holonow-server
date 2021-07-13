require('dotenv').config();
const channels = require('../channel_ids.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const {google} = require('googleapis');

const parseVideoId = (videoNameMetaData) =>{
  console.log("parseVideoId start");
  let videoId = null;
  parseString(videoNameMetaData, function (err, result) {
      let videoName = result.feed.entry[0].id[0].split(':')
      videoId = videoName[videoName.length-1];        
  })
  return videoId;    
}

module.exports = async() => {
  console.log("video list api start");
  const xmlFetches = channels.map((channel) => (
    axios.get('https://www.youtube.com/feeds/videos.xml', {
      params: {
        channel_id: channel.id,
        t: Date.now(),
      },
    })
    .then((xmlResult) => {
        return parseVideoId(xmlResult.data);
    })
    .catch((error)=>{
        console.log(error)
    })
  ));
      
  let videoList = (await Promise.all(xmlFetches)).flat();
  console.log("video list api end");
  return videoList;
};