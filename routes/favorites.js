const express = require('express');
const router = express.Router();

const {
    getFavorites,
    addToFavorites,
    removeFromFavorites
} = require('../controllers/favoritesController')

router.get('/', getFavorites)
router.post('/add', addToFavorites)
router.post('/remove', removeFromFavorites)

module.exports = router