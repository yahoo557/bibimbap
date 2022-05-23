const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어
// const bodyparser = require("body-parser"); // HTTP body 파싱
// router.use(bodyparser.urlencoded({ extended: false }));
const Query = require('pg').Query // DB 쿼리
const bcrypt = require("bcrypt"); // 비밀번호 암호화
const jwt = require("jsonwebtoken");
const client = require("../config/db.config"); // DB 연결
const path = require('path');

router.get('/', (req, res ) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});
router.post('/', (req, res, next) => {
  console.log(req.body);
  const user_id_input = req.body.userId;
  const user_pw_input = req.body.userPw;
  const text = 'SELECT * FROM users WHERE username = $1';
  client.query(text, [user_id_input], (err, rows) => {
    if (rows.rows.length > 0) {
      const password_db = rows.rows[0].password;
      //암호화되어 저장되어있는 비밀번호를 다시 복호화 하여 입력된 비밀번호와 일치 여부를 확인하는 메소드
      if (bcrypt.compareSync(user_pw_input, password_db)) {
        jwt.sign(
          {
            id: rows.rows[0].id
          },
          secret_key.secret,
          {
            expiresIn: 86400, //24hour
          },
          (err, token) => {
            return res.status(200).send({
              id: rows.rows[0].id,
              username: rows.rows[0].nickname,
              accessToken: token
            });
          });
      }
      else {
        //에러 발생시 404 에러코드와 메세지 호출
        return res.send({msg : "ID / PW 오류"});
      }
    }
    else {
      //에러 발생시 404 에러코드와 메세지 호출
      return res.redirect('/login');
    }
  });

});
// =================================
module.exports = router;