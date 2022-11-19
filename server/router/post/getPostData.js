const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/:id', (req, res) => {
    if(!req.params.id || req.params.id < 0) return res.status(500).send();

    const getDataQuery = 'SELECT a.*, b.username, b.nickname FROM post AS a INNER JOIN users AS b ON a.post_id = $1 AND a.user_id = b.user_id';
    client.query(getDataQuery, [req.params.id], (err, resultRows) => {
        if(resultRows.length < 1) return res.status(500).send();
        return res.status(200).send(resultRows.rows[0]);
    })
});



module.exports = router;