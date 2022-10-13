const {getChannelInfo} = require('./youtubeHelper')
const channels = require('../channel_ids.json');
const Channel = require('../models/channel')
const DbHelper = require('../helpers/dbHelper')
const dbHelper = new DbHelper();

const setupHelper = async () => {
    console.log("setting up")

    let channelCount = await dbHelper.getChannelCount()
    if(channelCount < channels.length) {
        refreshChannels()
    }

    //add code to refresh all livestreams on start up
    //add code to set up interval to refresh livestreams
}

const refreshChannels = async () => {
    let channelInfo = await getChannelInfo();
    
    channelInfo.forEach(channel => {
        console.log(channel.snippet.thumbnails)
        let data = {
            id: channel.id,
            title: channel.snippet.title,
            subscribers: channel.statistics.subscriberCount,
            thumbnail: {
                url: channel.snippet.thumbnails.high.url,
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