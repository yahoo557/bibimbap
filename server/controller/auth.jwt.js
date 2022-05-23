const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


const verifyToken = (res, req, next) => {
  const parseCookie = str =>
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
  const token = parseCookie(req.headers.cookie).accessToken;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err.name === 'TokenExpiredError') {
      return res.status(419).send({
        message: "Expired token"
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(409).send({
        message: "Unvalid token"
      })
    }
    next();
  });
};

module.exports = verifyToken;