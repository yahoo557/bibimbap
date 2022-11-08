const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');


router.get('/:id', (req, res)=>{
    const checkId = "SELECT a.* FROM post AS a INNER JOIN users AS b ON a.user_id = b.user_id AND a.post_id = $1 AND b.username= $2";
    const deleteQuery = "DELETE from post where post_id = $1"
    dt.decodeTokenPromise(req).then((decode) => {
        client.query(checkId, [req.params.id, decode.userData.username], (err, rows) => {
            if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 1"})
            if(rows.rows.length < 1) return res.status(202).send({msg: "권한이 없습니다", redirect: `/viewPost/${req.params.id}`})
            client.query(deleteQuery, [req.params.id], (err, r) => {
               if(err) {
                console.log(err)
                return res.status(404).send({msg: err})
            }
                else return res.status(200).send({msg: "삭제되었습니다."});
            });
        });
    }).catch((e) => {
        return res.status(202).send({msg: "로그인이 필요합니다.", redirect: `/login?redirect=${encodeURIComponent(`/viewPost/${req.params.id}?edit=true`)}`})
    });
})

module.exports = router;

