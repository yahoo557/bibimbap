const express = require("express");
const router = express.Router();

const path = require('path');
const { isBuffer } = require("util");
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query

const dt = require('../controller/decode.jwt.js');

// const alertMessage = (msg) => {
//     return `<script>alert(${msg})</script>`;
// } 

router.get("/", (req, res) => {
    dt.decodeTokenPromise((req)).then((decode) => {
        const obj = {
            isEdit: false,
            post_id: -1,
            title: "",
            contents: ""
        }
        return res.render(path.join(__dirname, '../public', 'post.ejs'), obj);
    }).catch((e) => {
        console.log(e);
        return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "로그인이 필요합니다", redirect: `/login?redirect=${encodeURIComponent('/post')}`});
    });
});

//AJAX 통신이므로 프론트에서 리스너로 alert, redirect 처리
router.post('/', (req, res, next)=> {
    dt.decodeTokenPromise(req).then((decode) => {   
        const getIdQuery = "SELECT user_id FROM users WHERE username = $1";

        client.query(getIdQuery, [decode.userData.username], (err, idRows) => {
            if(err) {
                return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
            }
            if(idRows.rows.length < 1) {
                return res.status(202).send({msg: "인증 오류입니다."});
            }

            // console.log(token);
            //POST 로 넘긴 데이터를 body 변수로 받음
            //const body = JSON.parse(req.body);
            //잘못 넘겨서인지 key:value 가 아니라 "json":  으로 와서 key값 추출
            //const postData = JSON.parse(req.body);
            //parse 처리하니 잘나옴.
            console.log(req.body.contents);
            const query_text = 'INSERT INTO post(title, body, timestamp, user_id) VALUES($1, $2, NOW(), $3) RETURNING *';
            const data_arr = [
                req.body.title,
                JSON.stringify(req.body.contents),
                idRows.rows[0].user_id
            ];

            client.query(query_text, data_arr, (err, rows) => {
                if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 2"});
                return res.status(200).send({msg: "글이 업로드 되었습니다.", redirect: `/viewPost/${rows.rows[0].post_id}`});
            });
        })
    }).catch((e) => {
        return res.status(202).send({msg: "로그인이 필요합니다", redirect: `/login?redirect=${encodeURIComponent('/post')}`});
    });
});

router.post('/edit/:id', (req, res) => {
    const checkId = "SELECT a.* FROM post AS a INNER JOIN users AS b ON a.user_id = b.user_id AND a.post_id = $1 AND b.username= $2";
    const updateQuery = "UPDATE post SET title = $1, body = $2 WHERE post_id = $3";

    dt.decodeTokenPromise(req).then((decode) => {
        client.query(checkId, [req.params.id, decode.userData.username], (err, rows) => {
            if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 1"})
            if(rows.rows.length < 1) return res.status(202).send({msg: "권한이 없습니다", redirect: `/viewPost/${req.params.id}`})
            client.query(updateQuery, [req.body.title, req.body.contents, req.params.id], (err, r) => {
               if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 2"})
                return res.send({msg: "수정되었습니다.", redirect: `/viewPost/${req.params.id}`});
            });
        });
    }).catch((e) => {
        return res.status(202).send({msg: "로그인이 필요합니다.", 
                                    redirect: `/login?redirect=${encodeURIComponent(`/viewPost/${req.params.id}?edit=true`)}`})
    });
});

module.exports = router;