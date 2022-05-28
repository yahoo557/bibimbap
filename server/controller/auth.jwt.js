const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const redirectWithMsg = require("../controller/redirectWithMsg.js")

verifyToken = (req, res, next) => {
    const parseCookie = str => 
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {});


    if (!req.headers.cookie) {
        return redirectWithMsg(res, 202, {msg:`로그인이 필요한 서비스입니다`, redirect:"/login"});
    }

    const token = parseCookie(req.headers.cookie).accessToken;

    if (!token) {
        return redirectWithMsg(res, 202, {msg:`로그인이 필요한 서비스입니다`, redirect:"/login"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
        return res.status(419).send({
        message: "Unauthenticate"
        });
    }
    next();
    });
};

module.exports = verifyToken;