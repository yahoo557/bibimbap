const express = require('express');
const router = express.Router();
const path = require('path');



const { Pool, Client } = require('pg')
const Query = require('pg').Query

const client = new Client({
    user: 'seungbaek',
    host: '127.0.0.1',
    database: 'noldaga',
    password: '111111',
    port: 5432,
});
client.connect();



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
            res.render(path.join(__dirname, '../public', 'viewPost.ejs'),{rows:strJson});
        }
        else {
            console.log("게시글이 존재하지 않습니다.");
        }
    });
    
});

module.exports = router;