const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

//JWT를 위한 config와 미들웨어
const secret_key = require("../config/auth.config");
const jwt = require("jsonwebtoken");



router.get('/', (req, res, next) => {
    return res.status(200).cookie('accessToken' ,'' ,{maxAge : 0}).cookie('user' ,'' ,{maxAge : 0}).redirect("/");
});
// =================================

module.exports = router;
