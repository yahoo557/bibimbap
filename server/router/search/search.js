const express = require('express');
const client = require("../../config/db.config.js");
const router = express.Router();

router.post('/blog', (req, res) => {
    const searchQuery = "SELECT a.*, b.nickname FROM blog AS a INNER JOIN users AS b ON a.blogname LIKE '%' || $1 || '%' AND a.user_id = b.user_id";

    if(req.body.searchText.length < 2) {
        return res.status(202).send({msg: "검색어를 두 글자 이상 입력하세요"});
    }

    client.query(searchQuery, [req.body.searchText], (err, rows) => {
        if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
        return res.status(200).send({rows: rows.rows});
    });
});

router.post('/post', (req, res) => {
    const searchQuery = "SELECT a.*, b.nickname, c.blogname FROM post AS a INNER JOIN users AS b ON a.title LIKE '%' || $1 || '%' AND a.user_id = b.user_id INNER JOIN blog AS c ON a.user_id = c.user_id"

    if(req.body.searchText.length < 2) {
        return res.status(202).send({msg: "검색어를 두 글자 이상 입력하세요"});
    }

    client.query(searchQuery, [req.body.searchText], (err, rows) => {
        if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
        return res.status(200).send({rows: rows.rows});
    });
});

router.post('/nickname', (req, res) => {
    const searchQuery = "SELECT a.*, b.nickname FROM blog AS a INNER JOIN users AS b ON b.nickname LIKE '%' || $1 || '%' AND a.user_id = b.user_id";

    if(req.body.searchText.length < 2) {
        return res.status(202).send({msg: "검색어를 두 글자 이상 입력하세요"});
    }

    client.query(searchQuery, [req.body.searchText], (err, rows) => {
        if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
        return res.status(200).send({rows: rows.rows});
    });
});

module.exports = router;