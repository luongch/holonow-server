require('dotenv').config();
const channels = require('../channel_ids.json');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const moment = require('moment')

const parseVideoData = (videoData) =>{
  let video = {};
  parseString(videoData, function (err, result) {
    video = {
      id: result.feed.entry[0]['yt:videoId'][0],
      channelId: result.feed.entry[0]['yt:channelId'][0],
      title: result.feed.entry[0].title[0],
      author: result.feed.entry[0].author[0].name[0]
    };
  })
  return video;
}

const getVideoList = async() => {
  const xmlFetches = channels.map((channel) => (
    axios.get('https://www.youtube.com/feeds/videos.xml', {
      params: {
        channel_id: channel.id,
        t: moment(),
      },
    })
    .then((xmlResult) => {
        return parseVideoData(xmlResult.data);
    })
    .catch((error)=>{
        console.log(error)
    })
  ));
  
  let videoList = (await Promise.all(xmlFetches)).flat();

  return videoList;
};

module.exports = getVideoList //why can I not wrap this in curly brackets?