const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/:id', (req, res) => {
    const getIDQuery = 'SELECT username FROM users WHERE user_id = $1';
    client.query(getIDQuery, [req.params.id], (err, resultRows) => {
        if(resultRows < 1) return res.status(500).send();
        return res.status(200).send(resultRows.rows[0]);
    })
})

module.exports = router;