const express = require('express');
const router = express.Router();
const path = require('path');
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query




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

router.get("/:id",(req, res)=>{
    const text = 'SELECT * FROM post WHERE post_id = $1 ';    
    const id = req.params.id;
    client.query(text,[id], (err, rows) => {    
        var strJson = JSON.parse(rows.rows[0].body.slice(1,-1));
        if(rows.rows.length >0){
            // 요청한 url이 localhost:8000/viewPost/:id?edit=true 이면 해당 게시글의 수정을 요청하는것으로 간주
            if(req.query.edit){
                return res.render('post',{rows:strJson});
            }
            else {
                res.render(path.join(__dirname, '../public', 'viewPost.ejs'),{rows:strJson});
            }
        }
        else {
            console.log("게시글이 존재하지 않습니다.");
        }
    }); 
});

router.get("/delete/:id",(req, res)=>{
    const text = 'SELECT * FROM post WHERE post_id = $1';    
    const delete_txt = 'DELETE from post WHERE post_id = $1';
    const id = req.params.id;
    client.query(text,[id], (err, rows) => {
        if(rows.rows.length >0){
            if(confirm("게시글을 삭제하시겠 습니까?")){
                client.query(delete_txt,[id], (err, rows) => {
                })
            }
        }
        else {
            console.log("게시글이 존재하지 않습니다.");
        }
    });
    
});

router.post("/", (req, res) => {
    const param = [req.body.id];
    const sql = "SELECT * FROM posts WHERE id = $1";
    client.query(sql, param, (err, rows) => {
        if(err) {
            
            return;
        }
        res.send(rows.rows[0].body.slice(1, -1));
    });
});

module.exports = router;