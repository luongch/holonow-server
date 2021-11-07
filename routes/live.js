const express = require('express');
const router = express.Router();
const {
    getLiveStreams,
    // refreshLiveStreams
} = require('../controllers/live')

router.get('/', getLiveStreams)
// router.get('/', refreshLiveStreams)

module.exports = router;
