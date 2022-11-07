const express = require('express');
const router = express.Router();

router.use('/uploadThumbnail', require('./uploadThumbnail.js'));
router.use('/getThumbnail', require('./getThumbnail.js'));

module.exports = router;