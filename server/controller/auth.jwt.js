const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


verifyToken = (res, req, next) => {
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
    if (err) {
      return res.status(419).send({
        message: "Unauthenticate"
      });
    }
    next();
  });
};

module.exports = verifyToken;