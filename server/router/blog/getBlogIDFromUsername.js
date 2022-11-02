const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/', (req, res) => {
    if(!req.body.hasOwnProperty('username')) return res.status(404).send();
    const username = req.body.username;

    const getIDQuery = 'SELECT a.blog_id FROM blog AS a INNER JOIN users AS b ON a.user_id = b.user_id AND b.username = $1';
    client.query(getIDQuery, [req.body.username], (err, blogIDRows) => {
        if(err || blogIDRows.rows.length < 1) return res.status(500).send();
        return res.status(200).send(blogIDRows.rows[0]);
    })
});

module.exports = router;