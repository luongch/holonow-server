const {getChannelInfo} = require('./youtubeHelper')
const channels = require('../channel_ids.json');
const Channel = require('../models/channel')
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();
const youtubeHelper = require("./youtubeHelper")

const setupHelper = async () => {
    console.log("setting up")

    let channelCount = await dbHelper.getChannelCount()
    if(channelCount < channels.length) {
        refreshChannels()
    }
    getAllVideos()

    setInterval(function() {
        console.log("refreshing videos on interval")
        getAllVideos(false) 
    }, 1000*60) //60 seconds
}

/**
 * Get all past videos and livestreams from XML on server start up
 */
const getAllVideos = async (refreshAll = true) => {
    let streamingVideoList = await youtubeHelper.getLiveStreams(refreshAll)
    streamingVideoList.forEach(video => {
        dbHelper.addVideo(video)
    });
}

const refreshChannels = async () => {
    let channelInfo = await getChannelInfo();
    
    channelInfo.forEach(channel => {
        // console.log(channel.snippet.thumbnails)
        let data = {
            id: channel.id,
            title: channel.snippet.title,
            subscribers: channel.statistics.subscriberCount,
            thumbnail: {
                url: channel.snippet.thumbnails.default.url,
                width: channel.snippet.thumbnails.width,
                height: channel.snippet.thumbnails.height,
            }
        }
        let channelModel = new Channel(data).toObject();
        delete channelModel._id;
        
        dbHelper.addChannel(channelModel)
    })
}



module.exports =  {setupHelper};