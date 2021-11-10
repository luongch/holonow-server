const express = require('express');
const router = express.Router();
const {
    getLiveStreams,
    // getAllVideos
    // refreshLiveStreams
} = require('../controllers/live')

router.get('/', getLiveStreams)
// router.get('/all', getAllVideos)
// router.get('/', refreshLiveStreams)

module.exports = router;
