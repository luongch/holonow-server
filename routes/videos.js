const express = require('express');
const router = express.Router();
const {
    getLivestreams,
    getAllVideos,
    getArchivedVideos,
    getUpcomingLivestreams
    // refreshLiveStreams
} = require('../controllers/live')

router.get('/live', getLivestreams);
router.get('/', getAllVideos);
router.get('/archived', getArchivedVideos);
router.get('/upcoming', getUpcomingLivestreams)
// router.get('/', refreshLiveStreams)

module.exports = router;
