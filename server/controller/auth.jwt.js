const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


verifyToken = (res, req, next) => {
    const token = req.headers.cookie["accessToken"];
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
    if (err.name === 'JsonWebTokenError'){
      return res.status(409).send({
        message: "Unvalid token"
      })
    }
    console.log(decoded.id, decoded.token);
    next();
  });
};

module.exports = verifyToken;