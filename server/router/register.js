const express = require("express");
const router = express.Router();
const Query = require('pg').Query
const bcrypt = require("bcrypt");
const client = require("../config/db.config");
const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
    
});

router.post('/', (req, res, next) => {
    const text_insert = `INSERT INTO users(username, password, nickname, passwordq, passworda, blogname) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const text_insert_blog = `INSERT INTO blog(blogname, user_id) VALUES ($1, $2)`;

    const text_check_username = 'SELECT * FROM users WHERE username = $1';
    const text_check_nickname = 'SELECT * FROM users WHERE nickname = $1';
    const text_check_blogname = 'SELECT * FROM blog WHERE blogname = $1';
    const list_check_empty = ['아이디, ', '비밀번호, ', '비밀번호 확인, ', '비밀번호 찾기 질문, ', '비밀번호 찾기 답변, ', '블로그 제목, ' ];
    const isrobot = new Boolean(true);
    const password = bcrypt.hashSync(req.body.userPassword, 10);
    //const passwordAns = bcrypt.hashSync(req.body.findPasswordAnswer, 10);
    const values = [
        req.body.userName,
        password,
        req.body.userNickname,
        req.body.findPasswordQuestion,
        req.body.findPasswordAnswer,
        req.body.blogName
    ];

    // 공백 검출 코드
    var msg = ''
    values.forEach(function(element, index){
        if(element = ''){
            msg += list_check_empty[element.index];
        }
    });
    if(msg != ''){
        msg = msg.slice(0,-2)
        msg += '를 입력하여 주십시오.'
        return res.status(202).send({msg : msg});
    }
    if (req.body.userPassword != req.body.userPasswordConfirm) {
        return res.status(202).send("비밀번호가 일치하지 않습니다.");
    };
    var passwordExp = /^[a-zA-z0-9]{8,16}$/; 
    if (!passwordExp.test(req.body.userPassword)){
        return res.status(202).send("8~16자 영소/대문자 + 숫자의 조합으로 지정하세요.");
    }
    client.query(text_check_username, [values[0]], (err, rows) => {
        if (rows.rows.length > 0) {
            return res.status(202).send({msg : "이미 사용중인 아이디 입니다."});
        }
        client.query(text_check_nickname, [values[2]], (err, rows) => {
            if (rows.rows.length > 0) {
                return res.status(202).send({msg : "이미 사용중인 닉네임 입니다."});
            }
            client.query(text_check_blogname, [values[5]], (err, rows) => {
                if (rows.rows.length > 0) {
                    return res.status(202).send({msg : "이미 사용중인 블로그제목 입니다."});
                }
                client.query(text_insert, values, (err, rows) => {
                    
                    if(err){
                        console.log(err)
                        return res.status(202).send({msg : err});
                    }
                    client.query(text_insert_blog, [req.body.blogName, rows.rows[0].user_id], (err, rows) => {
                        if(err) {
                            return res.status(202).send({msg: err});
                        }
                        return res.status(200).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                                                {msg : "회원가입에 성공하였습니다.", redirect: '/login'});
                    });
                });
            });
        });
    });
});

module.exports = router;