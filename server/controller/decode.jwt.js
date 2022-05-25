const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

//Token verify & decode functions

//Callback
decodeToken = (req, callback) => {
    let token = ''
    if(req.headers.cookie) {
        const parseCookie = str => 
            str.split(';').map(v => v.split('=')).reduce((acc, v) => {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
        token = parseCookie(req.headers.cookie).accessToken;
    }

    if (!token) {
        return callback({verify: false});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return callback({verify: false});
        }
        callback({verify: true, userData: decoded});
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
        }

        if (!token) {
            return reject({verify: false});
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return reject({verify: false});
            }
            return resolve({verify: true, userData: decoded});
        });
    });
};

module.exports = {
    decodeToken: decodeToken,
    decodeTokenPromise: decodeTokenPromise
};