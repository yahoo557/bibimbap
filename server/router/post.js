const express = require("express");
const router = express.Router();

const path = require('path');
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query

const dt = require('../controller/decode.jwt.js')

router.get("/", (req, res) => {
    dt.decodeTokenPromise((req)).then((decode) => {
        return res.sendFile(path.join(__dirname, '../public', 'post.html'));
    }).catch((e) => {
        console.log(e);
        return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "로그인이 필요합니다", redirect: '/login'});
    });
});


router.post('/', (req, res, next)=> {
    dt.decodeTokenPromise(req).then((decode) => {   
        const getIdQuery = "SELECT user_id FROM users WHERE username = $1";
        const insertQuery = "INSERT INTO"

        client.query(getIdQuery, [decode.userData.username], (err, idRows) => {
            if(err) {
                return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "DB ERROR", redirect: '/post'});
            }
            if(idRows.rows.length < 1) {
                return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "잘못된 토큰입니다", redirect: '/post'});
            }

            // console.log(token);
            //POST 로 넘긴 데이터를 body 변수로 받음
            //const body = JSON.parse(req.body);
            //잘못 넘겨서인지 key:value 가 아니라 "json":  으로 와서 key값 추출
            //const postData = JSON.parse(req.body);
            //parse 처리하니 잘나옴.
            console.log(req.body.contents);
            const query_text = 'INSERT INTO posts(title, body, create_date, user_id) VALUES($1, $2, NOW(), $3) RETURNING *';
            const data_arr = [
                req.body.title,
                JSON.stringify(req.body.contents),
                idRows.rows[0].user_id
            ];

            client.query(query_text, data_arr, (err, rows) => {
                if(err) {
                    return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "DB ERROR", redirect: '/post'});
                }
                return res.status(200).send({msg: "글이 업로드 되었습니다.", redirect: `/viewPost/${rows.rows[0].post_id}`})
            });
        })
    }).catch((e) => {
        return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "로그인이 필요합니다", redirect: '/login'});
    });
});

router.post('/edit/:id', (req, res) => {
    res.send({msg: 완료});
});

module.exports = router;