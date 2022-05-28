const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const path = require('path');
const three = require('three');
const dt = require('../controller/decode.jwt.js');


router.get('/:id', (req, res) => {
    const object_id = req.params.id;
    const text_check_object = 'SELECT * FROM object WHERE object_id = $1';
    const text_get_post = 'SELECT * FROM object WHERE object_id = $1';
        client.query(text_check_object, [object_id], (err, rows)=>{
            if(rows.rows.length>0){
                res.status(200).send({post_id : rows.rows[0].post_id})                
            }
            else {
                res.status(404).send({msg : err})
            }
        });   
});


module.exports = router;