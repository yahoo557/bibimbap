const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어
const bodyparser = require("body-parser"); // HTTP body 파싱
router.use(bodyparser.urlencoded({ extended: false }));
const Query = require('pg').Query // DB 쿼리
const bcrypt = require("bcrypt"); // 비밀번호 암호화
const jwt = require("jsonwebtoken");
const secret_key = require("../config/auth.config");
const client = require("../config/db.config"); // DB 연결
const path = require('path');


router.get('/', (req, res ) => {
  
  
});

// =================================
module.exports = router;