const express = require('express');
const router = express.Router();
const path = require('path');
const { Pool, Client } = require('pg');
const Query = require('pg').Query;

const client = new Client({
    user: 'bibimbap',
    host: '127.0.0.1',
    database: 'noldaga',
    password: 'bi1234',
    port: 5432,
});
client.connect();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'viewPost.html'));
});

router.post("/", (req, res) => {
    const param = [req.body.id];
    const sql = "SELECT * FROM posts WHERE id = $1";
    client.query(sql, param, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log(rows.rows[0].body);
        res.send(rows.rows[0].body.slice(1, -1));
    });
});

module.exports = router;