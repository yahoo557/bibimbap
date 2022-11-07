const express = require('express');
const router = express.Router();

const dt = require('../../controller/decode.jwt.js');
const client = require('../../config/db.config.js');

router.post('/', (req, res) => {
    dt.decodeTokenPromise(req).then((decode) => {
        const getIDQuery = 'SELECT user_id FROM users WHERE username = $1';
        client.query(getIDQuery, [decode.userData.username], (err, resultRows) => {
            if(err) {
                return res.status(500).send({msg : "DB ERROR"});
            }
            if(resultRows.rows.length < 1) {
                return res.status(500).send({msg : "Auth Error"});
            }

            const insertPostQuery = 'INSERT INTO post(title, body, timestamp, user_id) VALUES($1, $2, NOW(), $3) RETURNING *';
            const argumentArray = [
                req.body.title,
                JSON.stringify(req.body.contents),
                resultRows.rows[0].user_id
            ];
            client.query(insertPostQuery, argumentArray, (err, rows) => {
                if(err) return res.status(500).send({msg: 'DB Error - 2'});
                return res.status(200).send({msg: "작성이 완료되었습니다.", redirect: `/post/read?id=${rows.rows[0].post_id}`});
            })
        })
    }).catch(e => {
        return res.status(500).send({msg: "Auth Error"});
    });
});

module.exports = router;