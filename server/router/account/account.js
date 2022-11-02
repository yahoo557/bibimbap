const express = require('express');
const router = express.Router();

router.use('/checkLoginStatus', require('./checkLoginStatus.js'));
router.use('/login', require('./login.js'));
router.use('/logout', require('./logout.js'));
router.use('/getUsername', require('./getUsername.js'));
router.use('/duplicateCheck', require('./duplicateCheck.js'));
router.use('/getUserInfo', require('./getUserInfo.js'));
router.use('/changeUserInfo', require('./changeUserInfo.js'));

module.exports = router;