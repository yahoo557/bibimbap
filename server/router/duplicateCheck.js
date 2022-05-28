const express = require('express');
const router = express.Router();

const client = require("../config/db.config");

router.post("/username", (req, res) => {
    const selQuery = "SELECT username FROM users WHERE username = $1";
    client.query(selQuery, [req.body.username], (err, rows) => {
        if(err) return res.status(404).send({code: -1});
        if(rows.rows.length > 0) return res.status(202).send({code: 1});
        return res.status(200).send({code: 0});
    })
});

router.post("/nickname", (req, res) => {
    const selQuery = "SELECT nickname FROM users WHERE nickname = $1";
    client.query(selQuery, [req.body.nickname], (err, rows) => {
        if(err) return res.status(404).send({code: -1});
        if(rows.rows.length > 0) return res.status(202).send({code: 1});
        return res.status(200).send({code: 0});
    })
});

router.post("/blogname", (req, res) =>{
    const selQuery = "SELECT blogname FROM blog WHERE blogname = $1";
    client.query(selQuery, [req.body.blogname], (err, rows) => {
        console.log(req.body);
        if(err) return res.status(404).send({code: -1});
        if(rows.rows.length > 0) return res.status(202).send({code: 1});
        return res.status(200).send({code: 0});
    })
});

module.exports = router;