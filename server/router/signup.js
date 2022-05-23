const express = require("express");
const router = express.Router();

const path = require('path');

const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});


module.exports = router;