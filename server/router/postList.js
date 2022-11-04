const express = require("express");
const router = express.Router();
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query
const path = require('path');

router.get("/:id", (req, res) => {
    const blog_id = req.params.id;
    const text = 'SELECT * FROM post Where user_id = (SELECT user_id From blog WHERE blog_id = $1);'
    
    client.query(text, [blog_id], (err, rows) => {
        if(err){
            return res.status(404).json({msg:err})
        }
        else {
            //쿼리 결과가 있다면
            if(rows.rows.length){
                return res.status(200).json(rows.rows);
            }
            else{
                return res.status(200).json({msg:"null"})
            }
            
        }
    })
});


router.post('/', (req, res, next)=>{
    res.send("DONE");
});

module.exports = router;