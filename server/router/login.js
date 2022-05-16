const express = require("express");
const router = express.Router();
const { Pool, Client } = require('pg')
const Query = require('pg').Query
const path = require('path');

const client = new Client({
    user: 'bibimbap',
    host: '127.0.0.1',
    database: 'noldaga',
    password: 'bi1234',
    port: 5432,
});
client.connect();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});


router.post('/', (req, res, next)=>{
    res.send("DONE");
});

module.exports = router;