const express = require('express');
const router = express.Router();
const path = require('path');
const { rows } = require('pg/lib/defaults');
const { domainToASCII } = require('url');
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query

const dt = require('../controller/decode.jwt.js');
const redirectWithMsg = require('../controller/redirectWithMsg.js');

const dbErr = (res, err) => {
    console.error();
    redirectWithMsg(res, 202, {msg: "DB Error", redirect:"/"})
};

router.get("/", (req, res) => {
    // 게시글 표시 페이지 나타내는 변수
    // DB에서 포스팅의 데이터를 읽어올 쿼리문 이다.
    const text = 'SELECT * FROM post';

    // 디비에 쿼리를쏴서 post테이블속 데이터를 다 가져옴
    client.query(text, (err, rows) => {

        // 게시글 존재여부 콜백 
        if(rows.rows.length >0){
            res.render(path.join(__dirname, '../public', 'viewList.ejs'),{rows:rows.rows});
        }
        else {
            console.log("게시글이 존재하지 않습니다.");
        }
    });
    
});

router.get("/:id", (req, res)=>{
    const text = 'SELECT * FROM post WHERE post_id = $1';
    const getUserIdQuery = 'SELECT * FROM users WHERE username = $1';
    const id = req.params.id;
    
    client.query(text, [id], (err, rows) => {  
        if(err) return console.log(err);
        if(rows.rows.length > 0){
            const postData = {
                post_id: rows.rows[0].post_id,
                title: rows.rows[0].title,
                contents: rows.rows[0].body,
                createdTime: rows.rows[0].timestamp.toLocaleString("ja-JP")
            }
            // 요청한 url이 localhost:8000/viewPost/:id?edit=true 이면 해당 게시글의 수정을 요청하는것으로 간주
            if(req.query.edit){
                dt.decodeTokenPromise(req).then((decode) => {
                    client.query(getUserIdQuery, [decode.userData.username], (err, userIdRows) => {
                        if(err) return dbErr(res, err);
                        if(userIdRows < 1) return redirectWithMsg(res, 202, {msg: "잘못된 사용자입니다.", redirect:`/viewPost/${id}`});

                        if(userIdRows.rows[0].user_id != rows.rows[0].user_id) {
                            return redirectWithMsg(res, 202, {msg: "권한이 없습니다.", redirect: `/viewPost/${id}`});
                        }

                        return res.status(200).render(path.join(__dirname, '../public', 'editPost.ejs'),
                                                        postData);
                    });
                }).catch((e) =>{
                    return redirectWithMsg(res, 202, {msg: "로그인이 필요합니다.", redirect: `/login?redirect=${encodeURIComponent(`/viewPost/${id}?edit=true`)}`});
                });
            }
            else {
                return res.render(path.join(__dirname, '../public', 'viewPost.ejs'), postData);
            }
        }
        else {
            return res.render(path.join(__dirname, '../public', 'showMsg.ejs'), {msg: "", redirect: '/notfound'});
        }
    }); 
});

router.get("/delete/:id",(req, res)=>{
    const getUserIdQuery = 'SELECT user_id FROM users WHERE username = $1';

    const text = 'SELECT * FROM post WHERE post_id = $1';    
    const delete_txt = 'DELETE from post WHERE post_id = $1';
    const targetPostId = req.params.id;

    dt.decodeTokenPromise((req)).then((decode) => {
        client.query(getUserIdQuery, [decode.userData.username], (err, userIdRows) => {
            if(err) return err;
            if(userIdRows.rows.length < 1) return;
            
            client.query(text, [targetPostId], (err, postRows) => {
                if(err) return;
                if(postRows.rows.length < 1) return;

                if(userIdRows.rows[0].user_id != postRows.rows[0].user_id) {
                    return redirectWithMsg(res, 202, {msg: "권한이 없습니다.", redirect: `/viewPost/${targetPostId}`})
                }

                client.query(delete_txt, [targetPostId], (err, rows) => {
                    if(err) return;
                    return redirectWithMsg(res, 200, {msg: "삭제했습니다.", redirect:"/"});
                });
            });
        });
    }).catch((e) => {
        return res.status(202).send("need login")
    });
});

router.post("/", (req, res) => {
    const param = [req.body.id];
    const sql = "SELECT * FROM post WHERE id = $1";
    client.query(sql, param, (err, rows) => {
        if(err) {   
            return;
        }
        res.send(rows.rows[0].body.slice(1, -1));
    });
});

module.exports = router;