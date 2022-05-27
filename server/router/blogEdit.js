const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const path = require('path');
const three = require('three');
const dt = require('../controller/decode.jwt.js');


router.get('/', (req, res) => {
    dt.decodeToken(req, (e) => {
        const object_list = []
        const myblog_id = e.userData.id;
        
        // const text = 'SELECT * FROM blog WHERE user_id = $1';
        const text = 'INSERT INTO blog (object_list) VALUES ($1) WHERE SELECT user_id FROM blog WHERE blog.user_id = $2;'
        client.query(text, [object_list, myblog_id], (err, rows) => {
            
        })
    });
});
