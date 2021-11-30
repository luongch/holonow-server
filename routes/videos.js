const express = require('express');
const router = express.Router();
const {
    getLiveStreams,
    getAllVideos
    // refreshLiveStreams
} = require('../controllers/live')

router.get('/live', getLiveStreams);
router.get('/', getAllVideos);
// router.get('/', refreshLiveStreams)

module.exports = router;
