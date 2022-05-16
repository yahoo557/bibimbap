const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어
const bodyparser = require("body-parser"); // HTTP body 파싱
router.use(bodyparser.urlencoded({ extended: false }));
const Query = require('pg').Query // DB 쿼리
const bcrypt = require("bcrypt"); // 비밀번호 암호화

//HTTP CORS를 위한 미들웨어
const cors = require("cors");
const corsOption = {
  origin : "http://localhost:3000/",
  optionsSuccessStatus: 200
}
router.use(cors());

const client = require("../config/db.config"); // DB 연결


router.post('/', (req, res, next) => {
  console.log(req.query);
  const user_id_input = req.query.user_id;
  const user_pw_input = req.query.user_pw;
  const text = 'SELECT * FROM users WHERE username = $1';
  client.query(text, [user_id_input], (err, rows) => {
    if (rows.rows.length > 0){
      const password_db = rows.rows[0].password;
      //암호화되어 저장되어있는 비밀번호를 다시 복호화 하여 입력된 비밀번호와 일치 여부를 확인하는 메소드
      if(bcrypt.compareSync(user_pw_input, password_db)){
        const message = rows.rows[0].nickname + " 님 반갑습니다.";


        res.status(200).send(message);
        return res.redirect('/')    
      }
      else {
        //에러 발생시 404 에러코드와 메세지 호출
        res.status(404).send("ID / PW 오류");
      }
    }
    else {
      //로그인에 성공하면 메인페이지로 새로고침되는 리턴문
      return res.redirect('/')    
    }

  })
  
  
})
// =================================
// ==============로그아웃==============

// =================================
module.exports = router;