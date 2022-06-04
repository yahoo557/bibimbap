const express = require('express');
const router = express.Router();

const client = require('../config/db.config.js');

router.post('/template', (req, res) => {
    const sql = "SELECT * FROM object_template";
    client.query(sql, [], (err, rows) => {
        if(err) return res.status(404).send({msg: "DB Error"});
        return res.status(200).send(rows.rows);
    });
});

module.exports = router;