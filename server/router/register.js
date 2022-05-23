const express = require("express");
const router = express.Router();
const Query = require('pg').Query
const bcrypt = require("bcrypt");
//const bodyparser = require("body-parser");

const client = require("../config/db.config.js");
const path = require("path");


//router.use(bodyparser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

router.post('/', (req, res, next) => {
    console.log(req.body);
    const text_insert = 'INSERT INTO users(username, password, nickname, passwordQ, passwordA, signup_date) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *';
    const text_check_username = 'SELECT * FROM users WHERE username = $1'
    const text_check_nickname = 'SELECT * FROM users WHERE nickname = $1'
    let result = ""
    if (req.body.password != req.body.passwordConfirm) {
        return res.status(404).send("비밀번호가 일치하지 않습니다.");
    };
    const isrobot = new Boolean(true);
    const password = bcrypt.hashSync(req.body.password, 10)
    const values = [
        req.body.userName,
        password,
        req.body.nickName,
        req.body.passwordQ,
        req.body.passwordA
    ];
    console.log(values);
    //client.connect();
    client.query(text_check_username, [values[0]], (err, rows) => {
        if (rows.rows.length == 0) {
            client.query(text_check_nickname, [values[2]], (err, rows) => {
                if (rows.rows.length == 0) {
                    client.query(text_insert, values, (err, rows) => {
                        if(err) {
                            console.log(err.message);
                            res.status(404).send("회원가입 실패");
                            return;
                        }
                        res.status(200).send("회원가입에 성공하였습니다.")
                    });
                }
            });
        }
    });

    if (result.length > 0) {
        return res.status(400).send(result)
    }
    else {
        
    }



});



module.exports = router;