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

    addVideo(videoData, next) {
        let video = extractVideoData(videoData)
        let query = {'id': video.id};
        Video.findOneAndUpdate(query, video, {upsert: true, new: true})
        .exec(function (err, vid) {
            if (err) {
                console.error("error from upsert", err);
                next(err)
            }
        });
    }
    upsert(videoData,next) {
        let video = extractVideoData(videoData)
        let query = {'channelId': video.channelId};

        Video.findOneAndUpdate(query, video, {upsert: true, new: true})
        .exec(function (err, vid) {
            if (err) {
                console.error("error from upsert", err);
                next(err)
            }
        });
    }
    getLivestreams(req,res,next) {
        let query = {'concurrentViewers': {$ne: null}}; 
        Video.find(query)
        .exec(function (err, liveStreams) {
            if (err) {
                console.log("error in getLivestreams")
                next(err)
            } 
            res.status(200).json({data: liveStreams})
        })
    }
    getArchivedVideos(req,res,next) {
        let query = {'concurrentViewers': {$eq: null}, 'actualStartTime':{$ne: null}};
        Video.find(query).sort({'actualStartTime':-1})
        .exec( function (err, archivedVideos) {
            if(err){
                next(err)
                console.error(err);
            }   
            res.status(200).json({data: archivedVideos})
        })
    }
    getAllVideos(req,res,next) {
        let query = {};
        Video.find(query)
        .exec(function (err, videos) {
            if (err) {
                next(err)
                console.error(err);
            } 
            res.status(200).json({data: videos})
        })
    }
    getUpcomingLiveStreams(req,res) {
        let currentDate = new Date().toISOString();
        let query = {'scheduledStartTime':{'$gt': currentDate}}
        Video.find(query).sort({'scheduledStartTime':1})
        .exec(function (err, upcomingVideos) {
            if (err) {
                console.error(err);
                next(err)
            }
            res.status(200).json({data: upcomingVideos});
        })
    }
    getLastDateFetched(req,res,next) {
        try {
            return Video.findOne({},'dateFetched', { sort: { 'dateFetched': -1 } })
            .exec()//why can't you put a function in exec? you used to be able to
        }        
        catch(err) {
            next(new Error("Couldn't get last dateFetched"))
        } 
        
    }
    getVideoCount(req,res,next) {
        let query = {};
        try {
            return Video.find(query)
            .countDocuments()
            .exec()
        }
        catch(err) {
            next(new Error("Couldn't get videoCount"))
        }
        
    }
}