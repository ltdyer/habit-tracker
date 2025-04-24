const express = require('express')
const router = express.Router();

const {
  getBirds
} = require('../controllers/birdController.js')

router.get('/birds', getBirds)

module.exports = router