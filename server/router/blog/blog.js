const express = require('express');
const router = express.Router();

router.use('/getBlogList', require('./getBlogList.js'));
router.use('/getBlogData', require('./getBlogData.js'));
router.use('/getBlogIDFromUsername', require('./getBlogIDFromUsername.js'));

module.exports = router;