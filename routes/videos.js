const express = require('express');
const router = express.Router();
const {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams,
    refreshLiveStreams
} = require('../controllers/videosController')

router.get('/', getAllVideos);
router.get('/live', 
    function(req,res,next) {
        refreshLiveStreams(req,res,next)
        next()
    },
    function(req,res,next) {
        getLivestreams(req,res,next)
    }
);
router.get('/upcoming', getUpcomingLivestreams)
router.get('/archived', getArchivedVideos);
// router.get('/', refreshLiveStreams)

module.exports = router;
