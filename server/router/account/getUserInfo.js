const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/', (req, res) => {
    dt.decodeTokenPromise(req).then(decode => {
        const getInfoQuery = "SELECT nickname, blogname, passwordq, passworda FROM users WHERE username = $1";
        client.query(getInfoQuery, [decode.userData.username], (err, queryResult) => {
            if(err) return res.status(500).send({msg: "DB Error"});
            if(queryResult.rows.length < 1) return res.status(500).send({msg: "Auth Error"});
            return res.status(200).send(queryResult.rows[0]);
        })
    }).catch(reason => {
       return res.status(500).send({msg: "Internal server error"});
    });
});

module.exports = router;