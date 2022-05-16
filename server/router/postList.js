const express = require("express");
const router = express.Router();
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query
const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'postList.html'));
});


router.post('/', (req, res, next)=>{
    res.send("DONE");
});

module.exports = router;