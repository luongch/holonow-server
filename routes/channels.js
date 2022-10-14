const { getChannels, getChannel, getFavoriteChannels } = require("../controllers/channelsController");
const express = require('express')

const router = express.Router();

router.get('/', getChannels)
router.get('/favorites', getFavoriteChannels) //this must be above :id
router.get('/:id', getChannel)



module.exports = router;