const Video = require('../models/video')
const Channel = require('../models/channel')
const { addToCache } = require('../utils/cache');

const extractVideoData = (videoData) => {
    let video = new Video({
        id: videoData.id,
        channelId: videoData.channelId,
        title: videoData.title,
        author: videoData.author,
        scheduledStartTime: videoData.scheduledStartTime ? videoData.scheduledStartTime : null,
        actualStartTime: videoData.actualStartTime ? videoData.actualStartTime : null,
        liveBroadcastContent: videoData.liveBroadcastContent,
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
    addChannel(channel) {
        let query = {'id': channel.id};
        Channel.findOneAndUpdate(query, channel, {upsert: true, new:true})
        .exec(function(err,channel) {
            if(err) {
                console.error("error from channel upsert", err)
            }
        })
    }
    getChannel(req,res,next) {
        let query = {'id':req.params.id}
        Channel.findOne(query)
        .exec(function(err, results) {
            if(err) {
                console.log("err getting channel")
                next(err)
            }
            addToCache(results)
            res.status(200).json({data:results})
        })
    }
    getAllChannels(req,res,next) {
        let query = {};
        Channel.find(query)
        .exec(function(err, results) {
            if(err) {
                console.log("err getting channels")
                next(err)
            }
            res.status(200).json({data:results})
        })
    }
    async search(req,res,next, searchTerms) {
        let query =  { $text : { $search : searchTerms } };

        let count = await Video.find(query)
        .countDocuments()
        
        let perPage = 15;
        let page = req.query.page ? req.query.page : 0;

        let results = await Video.find(query)
        .limit(perPage)
        .skip(perPage * page)
        .sort({'scheduledStartTime':-1})        

        res.status(200).json({
            data: results,
            count
        })
    }
    addVideo(videoData) {
        let video = extractVideoData(videoData)
        let query = {'id': video.id};
        Video.findOneAndUpdate(query, video, {upsert: true, new: true})
        .exec(function (err, vid) {
            if (err) {
                console.error(`error from upserting ${video.id}`, err);
            }
        });
    }
    getLivestreams(req,res,next) {
        //only show livestreams from the past 24hours
        let currentDate = new Date()
        currentDate.setDate(currentDate.getDate()-1)
        let query = {'liveBroadcastContent': 'live', 'concurrentViewers': {$ne: null}, 'actualStartTime': {'$gt':currentDate.toISOString()}  }; 
        Video.find(query)
        .exec(function (err, liveStreams) {
            if (err) {
                console.log("error in getLivestreams")
                next(err)
            } 
            res.status(200).json({data: liveStreams})
        })
    }
    async getArchivedVideos(req,res,next) {
        // let query = {'concurrentViewers': {$eq: null}, 'actualStartTime':{$ne: null}};
        let query = {'liveBroadcastContent':'none'}
        let count = await Video.find(query)
        .countDocuments()

        let perPage = 15;
        let page = req.query.page ? req.query.page : 0
        
        let results = await Video.find(query).sort({'actualStartTime':-1})
        .limit(perPage)
        .skip(perPage * page)

        res.status(200).json({
            data: results,
            count
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
        //need to look at scheduledStart time, just checking if upcoming leads to bugs
        let query = {'scheduledStartTime':{'$gt': currentDate}, 'liveBroadcastContent':'upcoming'}
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
    getChannelCount() {
        let query = {};
        try {
            return Channel.find(query)
            .countDocuments()
            .exec()
        }
        catch(err) {
            next(new Error("Couldn't get channelCount"))
        }
    }
}