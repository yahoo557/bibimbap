const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/', (req, res) => {
    const idQuery = "SELECT a.*, b.blog_id FROM users AS a INNER JOIN blog AS b ON a.username = $1 AND a.user_id = b.user_id";
    const insertQuery = `INSERT INTO object(model_path, model_rotation, model_position, create_date, update_date, template_id, post_id)
                        VALUES($1, $2, $3, NOW(), NOW(), $4, $5) RETURNING *`;
    const updateQuery = `UPDATE blog SET object_list = array_append(object_list, $1) WHERE blog_id = $2`;

    const objData = [
        req.body.model_path,
        req.body.model_rotation,
        req.body.model_position,
        req.body.template_id,
        req.body.post_id
    ];

    dt.decodeTokenPromise(req).then((decode) => {
        client.query(idQuery, [decode.userData.username], (err, idRows) => {
            if(err) return res.status(404).send('0');
            if(idRows.rows.length < 1) return res.status(404).send('1');
            if(idRows.rows[0].username != req.body.username) return res.status(404).send('2');
            client.query(insertQuery, objData, (err, upRows) => {
                if(err) return res.status(404).send(err);
                if(upRows.rows.length < 1) return res.status(404).send('4');
                client.query(updateQuery, [upRows.rows[0].object_id, idRows.rows[0].blog_id], (err, rows) => {
                    if(err) return res.status(404).send(err);
                    return res.status(200).send(`${upRows.rows[0].object_id}`);
                })
            })
        })
    }).catch((e) => {
        console.log(e)
        return res.status(404).send()
    });
})

module.exports = router;