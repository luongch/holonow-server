const Video = require('../models/video')

const extractVideoData = (videoData) => {
    let video = new Video({
        id: videoData.id,
        channelId: videoData.channelId,
        title: videoData.title,
        author: videoData.author,
        scheduledStartTime: videoData.scheduledStartTime ? videoData.scheduledStartTime : null,
        actualStartTime: videoData.actualStartTime ? videoData.actualStartTime : null,
        concurrentViewers: videoData.concurrentViewers ? videoData.concurrentViewers : null,
        activeLiveChatId: videoData.activeLiveChatId ? videoData.activeLiveChatId : null,
        thumbnails: videoData.thumbnails
    }).toObject();  //this toObject was needed in order for me to remove _id so findOneAndUpdate works,
    // otherwise it will try to update everything including _id which is immutable
    //https://stackoverflow.com/a/63265811
    delete video._id;
    return video;
} 
    
module.exports = class DbHelper {
    constructor() {
        
    }

    upsert(videoData) {
        let video = extractVideoData(videoData)
        let query = {'channelId': video.channelId};

        Video.findOneAndUpdate(query, video, {upsert: true, new: true}, function (err, vid) {
            if (err) return console.error("error from upsert", err);
        });
    }
    getLivestreams() {
        let query = {'concurrentViewers': {$ne: null}}; 
        return Video.find(query ,function (err, videos) {
            if (err) return console.error(err);
        })
    }
    getArchivedVideos() {
        let query = {'concurrentViewers': {$eq: null}, 'actualStartTime':{$ne: null}};
        return Video.find(query, function (err, videos) {
            if (err) return console.error(err);
        }).sort({'actualStartTime':-1})
    }
    getAllVideos() {
        let query = {};
        return Video.find(query, function (err, videos) {
            if (err) return console.error(err);
        })
    }
    getUpcomingLiveStreams() {
        let currentDate = new Date().toISOString();
        let query = {'scheduledStartTime':{'$gt': currentDate}}
        return Video.find(query, function (err, videos) {
            if (err) return console.error(err);
        }).sort({'scheduledStartTime':1})
    }
    getLastDateFetched() {
        return Video.findOne({},'dateFetched', { sort: { 'dateFetched': -1 } }, function (err, result) {
            if (err) return console.error("could not date fetched data");            
        })
    }
    getVideoCount() {
        let query = {};
        return Video.find(query, function (err, videos) {
            if (err) return console.error(err);
        }).countDocuments()
    }
}