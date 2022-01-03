const express = require('express');
const router = express.Router();
const {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams
    // refreshLiveStreams
} = require('../controllers/live')

router.get('/', getAllVideos);
router.get('/live', getLivestreams);
router.get('/upcoming', getUpcomingLivestreams)
router.get('/archived', getArchivedVideos);
// router.get('/', refreshLiveStreams)

module.exports = router;
