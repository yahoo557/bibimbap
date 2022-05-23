const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어
const bodyparser = require("body-parser"); // HTTP body 파싱
router.use(bodyparser.urlencoded({ extended: false }));

//JWT를 위한 config와 미들웨어
const secret_key = require("../config/auth.config");
const jwt = require("jsonwebtoken");



router.get('/', (req, res, next) => {
    return res.cookie('accessToken','', {maxAge : 0});
});
// =================================

module.exports = router;
