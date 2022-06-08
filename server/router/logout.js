const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

//JWT를 위한 config와 미들웨어
const secret_key = require("../config/auth.config");
const jwt = require("jsonwebtoken");

const auth = require('../controller/auth.jwt.js');
const redirectWithMsg = require('../controller/redirectWithMsg.js');

router.get('/', auth, (req, res, next) => {
    let redirectURL = '/';
    if(req.query.redirect){
        redirectURL = decodeURIComponent(req.query.redirect);
    }
    res.cookie('accessToken' ,'' ,{maxAge : 0}).cookie('user' ,'' ,{maxAge : 0});
    return redirectWithMsg(res, 200, {msg: "로그아웃되었습니다.", redirect: redirectURL});  
});
// =================================

module.exports = router;
