const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/', (req, res) => {
    const selectQuery = 'SELECT username FROM users ORDER BY RANDOM() LIMIT 1';
    client.query(selectQuery, [], (err, result) => {
       if(err) return res.status(500).send({msg: "DB Error"});
       if(result.rows.length < 1) return res.status(500).send({msg: "Internal server error"});
       return res.status(200).send(result.rows[0]);
    });
});

module.exports = router;