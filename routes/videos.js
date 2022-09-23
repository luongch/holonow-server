const express = require('express');
const router = express.Router();
const {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams,
    refreshLiveStreams
} = require('../controllers/videosController')

// router.get('/', getAllVideos);
router.get('/live', 
    async function(req,res,next) {
        await refreshLiveStreams(req,res,next)
        next()
    },
    function(req,res,next) {
        console.log("getting live streams")
        getLivestreams(req,res,next)
    }
);
router.get('/upcoming', getUpcomingLivestreams)
router.get('/archived', getArchivedVideos);
router.get('/', refreshLiveStreams)

module.exports = router;
