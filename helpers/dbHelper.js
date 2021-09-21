const mongoose = require('mongoose')
const DbConnectionHelper = require('./dbConnectionHelper.js');
const dbConnectionHelper = new DbConnectionHelper();
const moment = require('moment')

const videoSchema = new mongoose.Schema({
    id: String,
    channelId: String,
    title: String,
    author: String,
    dateFetched: Date,
    scheduledStartTime: Date,
    actualStartTime: Date,
    concurrentViewers: Number,
    activeLiveChatId: String
})

const Video = mongoose.model('Video', videoSchema)

const extractVideoData = (videoData) => {
    let video = new Video({
        id: videoData.id,
        channelId: videoData.channelId,
        title: videoData.title,
        author: videoData.author,
        dateFetched: videoData.dateFetched,
        scheduledStartTime: videoData.scheduledStartTime ? videoData.scheduledStartTime : null,
        actualStartTime: videoData.actualStartTime ? videoData.actualStartTime : null,
        concurrentViewers: videoData.concurrentViewers ? videoData.concurrentViewers : null,
        activeLiveChatId: videoData.activeLiveChatId ? videoData.activeLiveChatId : null
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

        Video.findOneAndUpdate(query, video, {upsert: true,new: true}, function (err, vid) {
            if (err) return console.error("error from upsert", err);
        });
    }
    getLiveStreams() {
        let query = {'concurrentViewers': {$ne:null}}; 
        return Video.find(query ,function (err, videos) {
            if (err) return console.error(err);
        })
    }
    getAllVideos() {
        return Video.find(function (err, videos) {
            if (err) return console.error(err);
        })
    }
    getUpcomingLiveStreams() {
        let currentDate = new Date().toISOString();
        let query = {'scheduledStartTime':{'$gt': currentDate}}
        return Video.find(query, function (err, videos) {
            if (err) return console.error(err);
        })
    }
    getLastDateFetched() {
        return Video.findOne({},'dateFetched', { sort: { 'dateFetched': -1 } }, function (err, result) {
            if (err) return console.error("could not date fetched data");            
        })
    }
}