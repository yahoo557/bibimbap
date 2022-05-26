const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

//Token verify & decode functions

//Callback
decodeToken = (req, callback) => {
    let token = '';
    let cookie = '';
    if(req.headers.cookie) {
        const parseCookie = str => 
            str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
        cookie = parseCookie(req.headers.cookie);
        token = parseCookie(req.headers.cookie).accessToken;
    }

    if (!token) {
        return callback({verify: false});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return callback({verify: false});
        }
        callback({verify: true, userData: decoded, cookie: cookie});
    });
};

//Promise
decodeTokenPromise = (req) => {
    return new Promise((resolve, reject) => {
        let token = ''
        if(req.headers.cookie) {
            const parseCookie = str => 
                str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                    return acc;
                }, {});
            token = parseCookie(req.headers.cookie).accessToken;
        } else { 
            throw new Error("로그인 없음")
        }

        if (!token) {
            throw new Error("로그인 없음");
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                throw err;
            }
            return resolve({verify: true, userData: decoded});
        });
    });
};

module.exports = {
    decodeToken: decodeToken,
    decodeTokenPromise: decodeTokenPromise
};