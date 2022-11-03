const express = require('express');
const router = express.Router();

router.use('/thumbnail', require('./thumbnail/thumbnail.js'));

module.exports = router;