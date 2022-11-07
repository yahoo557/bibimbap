const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/:id', (req, res) => {
    if(!req.params.id || req.params.id < 0) return res.status(500).send();

    const getDataQuery = 'SELECT a.*, b.username, b.nickname FROM post AS a INNER JOIN users AS b ON a.post_id = $1 AND a.user_id = b.user_id';
    client.query(getDataQuery, [req.params.id], (err, resultRows) => {
        if(resultRows.length < 1) return res.status(500).send();
        return res.status(200).send(resultRows.rows[0]);
    })
});

router.get("/list/:id", (req, res) => {
    const blog_id = req.params.id;
    const text = 'SELECT * FROM post Where user_id = (SELECT user_id From blog WHERE blog_id = $1);'
    
    client.query(text, [blog_id], (err, rows) => {
        if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 1"})
        
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

module.exports = router;