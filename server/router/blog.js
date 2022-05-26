const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const path = require('path');
const three = require('three');
const dt = require('../controller/decode.jwt.js');





// 내 블로그 
router.get('/myblog', (req, res) => {
    dt.decodeToken(req, (e) => {
        const myblog_id = e.userData.id;
        const text = 'SELECT * FROM blog WHERE user_id = $1';
        client.query(text, [myblog_id], (err, rows) => {
            return res.status(200).send({rows: rows.rows[0] , redirect: `/blog/`})
        })
    });
});


//타인 블로그
router.get('/:id', (req, res) => {  
    const blog_id = req.params.id;
        const text = 'SELECT * FROM blog WHERE blog_id = $1';
        client.query(text, [blog_id], (err, rows) => {
            if(err){
                return res.send({msg:err})
            }
            return res.status(200).send({rows: rows.rows[0] , redirect: `/blog/`})
    })
})
// =================================

// router.get('/', (req, res ) => {
  
// });


module.exports = router;