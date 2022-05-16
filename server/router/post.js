const express = require("express");
const router = express.Router();
// const Quill = require("quill");
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


const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({ extended: false }));

const path = require('path');
const e = require("express");


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'post.html'));
});


router.post('/', (req, res, next)=>{
    //POST 로 넘긴 데이터를 body 변수로 받음
    const body = req.body;

    //잘못 넘겨서인지 key:value 가 아니라 "json":  으로 와서 key값 추출
     const obj = Object.keys(body)
    
    //parse 처리하니 잘나옴.
    console.log(JSON.parse(obj).title);
    const query_text = 'INSERT INTO posts(title, body) VALUES($1, $2)';
    const data_arr = [
        JSON.parse(obj).title,
        obj
    ]
    // INSERT 쿼리문 쏴서 db에 저장
    client.query(query_text, data_arr , (err , rows) => {
        if(err) {
            console.log(err)
        }
        else {
            console.log(rows)
        }
    })
})
module.exports = router;