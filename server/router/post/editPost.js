const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/:id', (req, res) => {
    dt.decodeTokenPromise(req).then((decode) =>{
        const checkIDQuery = 'SELECT a.* FROM post AS a INNER JOIN users AS b ON a.user_id = b.user_id AND a.post_id = $1 AND b.username = $2';
        const updateQuery = 'UPDATE post SET title = $1, body = $2 WHERE post_id = $3';

        client.query(checkIDQuery, [req.params.id, decode.userData.username], (err, checkResult) => {
            if(err) return res.status(500).send({msg: "DB Error"});
            if(checkResult.rows.length < 1) return res.status(500).send({msg: "권한이 없습니다.", redirect: `/post/read?id=${res.params.id}`});
            client.query(updateQuery, [req.body.title, req.body.contents, req.params.id], (err, updateResult) => {
                if(err) return res.status(500).send({msg: "DB Error - 1"});
                return res.status(200).send({msg: "수정되었습니다.", redirect: `/post/read?id=${req.params.id}`});
            })
        })
    }).catch(e => {
        return res.status(500).send({msg: "로그인이 필요합니다.",
        redirect: `/login?redirect=${encodeURIComponent(`/post/edit?id=${req.params.id}`)}`});
    });
});

module.exports = router;