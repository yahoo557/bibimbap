const express = require('express');
const router = express.Router();

router.use('/getObjectByID', require('./getObjectByID.js'));
router.use('/getTemplate', require('./getTemplate.js'));
router.use('/deleteObject', require('./deleteObject.js'));
router.use('/editObject', require('./editObject.js'));
router.use('/placeObject', require('./placeObject.js'));

module.exports = router;