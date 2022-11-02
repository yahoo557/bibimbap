const express = require('express');
const router = express.Router();

router.use('/getPostData', require('./getPostData.js'));
router.use('/writePost', require('./writePost.js'));
router.use('/editPost', require('./editPost.js'));

module.exports = router;