const express = require('express'); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const bcrypt = require("bcrypt"); // 비밀번호 암호화
const jwt = require("jsonwebtoken");
const secret_key = require("../../config/auth.config.js");
const client = require("../../config/db.config.js"); // DB 연결

// router.get('/', (req, res ) => {
//     dt.decodeTokenPromise(req).then((decode) => {
//         return redirectWithMsg(res, 418, {msg: "이미 로그인되어 있습니다.", redirect: "/"});
//     }).catch((e) => {
//         return res.sendFile(path.join(__dirname, '../public', 'login.html'));
//     })
// });

// router.post("/", (req, res) => {
//     return res.status(200).send("LOGIN");
// })

router.post('/', (req, res) => {
    const user_id_input = req.body.userID;
    const user_pw_input = req.body.userPassword;
    const text = 'SELECT * FROM users WHERE username = $1';
    const redirectURL = (req.query.redirect) ? decodeURIComponent(req.query.redirect) : "/";

    client.query(text, [user_id_input], (err, rows) => {
    if (rows?.rows.length > 0) {
      const password_db = rows.rows[0].password;
      //암호화되어 저장되어있는 비밀번호를 다시 복호화 하여 입력된 비밀번호와 일치 여부를 확인하는 메소드
      if (bcrypt.compareSync(user_pw_input, password_db)) {
        jwt.sign(
          {
            id: rows.rows[0].id,
            username: rows.rows[0].username,
            nickname: rows.rows[0].nickname
          },
          secret_key.secret,
          {
            expiresIn: 86400, //24hour
          },
          (err, token) => {
            const expires = new Date();
            expires.setHours(expires.getHours()+24);

            nlogger.warn(`Login user: ${rows.rows[0].username}`);
            return res.status(200).cookie('accessToken' ,token ,{expires : expires}).cookie('user', rows.rows[0].nickname, {expires : expires}).send();
          });
      }
      else {
        //에러 발생시 404 에러코드와 메세지 호출
          nlogger.warn('Attempt login with wrong password');
          return res.status(404).send({msg : "등록되지 않은 아이디이거나, 비밀번호가 잘못되었습니다.", redirect: "/login"});
      }
    }
    else {
      //에러 발생시 404 에러코드와 메세지 호출
        nlogger.warn('Attempt login with wrong username');
        return res.status(404).send({msg : "등록되지 않은 아이디이거나, 비밀번호가 잘못되었습니다.", redirect: "/login"});
    }
    });
});

// router.post('/use', (req, res) => {
//    console.log(bcrypt.hashSync("bi1234", 10));
//    return res.status(200).send();
// });
// =================================
module.exports = router;
