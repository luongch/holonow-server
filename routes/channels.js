const { getChannels, getChannel } = require("../controllers/channelsController");
const express = require('express')

const router = express.Router();

router.get('/', getChannels)
router.get('/:id', getChannel)


module.exports = router;