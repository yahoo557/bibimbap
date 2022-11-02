const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const auth = require('../../controller/auth.jwt.js');
const redirectWithMsg = require('../../controller/redirectWithMsg.js');

// router.get('/', auth, (req, res, next) => {
//     let redirectURL = '/';
//     if(req.query.redirect){
//         redirectURL = decodeURIComponent(req.query.redirect);
//     }
//     res.cookie('accessToken' ,'' ,{maxAge : 0}).cookie('user' ,'' ,{maxAge : 0});
//     return redirectWithMsg(res, 200, {msg: "로그아웃되었습니다.", redirect: redirectURL});
// });

router.post('/', (req, res) => {
    return res.status(200).send("LOGOUT!");
});
// =================================

module.exports = router;
