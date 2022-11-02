const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/', (req, res) => {
    const getQuerySql = 'SELECT a.*, b.nickname FROM blog as a INNER JOIN users as b ON a.user_id = b.user_id ORDER BY RANDOM()';
    client.query(getQuerySql, [], (err, ret) => {
        if(err) {
            return res.status(500).send();
        }
        return res.status(200).send(JSON.stringify(ret.rows));
    });
});

module.exports = router;