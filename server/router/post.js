const express = require("express");
const router = express.Router();
// const Quill = require("quill");
const { Pool, Client } = require('pg')
const Query = require('pg').Query

const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({ extended: false }));
router.get("/", (req, res) => {
    res.sendFile('/Users/seungbaek/Desktop/Graduation_work/server/public/post.html');
});
const client = new Client({
    user: 'seungbaek',
    host: '127.0.0.1',
    database: 'noldaga',
    password: '111111',
    port: 5432,
});
client.connect();

router.post('/', (req, res, next)=>{
    
})
module.exports = router;