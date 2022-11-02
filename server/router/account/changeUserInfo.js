const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const clientPromise = (sql, data) => {
    return new Promise((resolve, reject) => {
       client.query(sql, data, (err, result) =>{
            if(err) reject(err);
            resolve(result);
       });
    });
}

const dt = require('../../controller/decode.jwt.js');

router.post('/', (req, res) => {
    const dtPromise = dt.decodeTokenPromise(req);

    const getUserIDSql = "SELECT username, user_id FROM users WHERE username = $1";
    const checkNicknameSql = "SELECT * FROM users WHERE nickname = $1 AND username <> $2";
    const checkBlognameSql = "SELECT * FROM users WHERE blogname = $1 AND username <> $2";

    const updateInfoSql = 'UPDATE users SET nickname = $1, passwordq = $2, passworda = $3 WHERE username = $4';
    const updateBlognameSql = 'WITH b AS (UPDATE users SET blogname = $1 WHERE user_id = $2 RETURNING *) UPDATE blog a SET blogname = b.blogname FROM b WHERE a.user_id = b.user_id';

    dtPromise.then((decode) => {
        const username = decode.userData.username

        Promise.all([clientPromise(getUserIDSql, [username]),
            clientPromise(checkNicknameSql, [req.body.nickname, username]),
            clientPromise(checkBlognameSql, [req.body.blogname, username])])
            .then((values) => {
                if (values[0].rows.length < 1) return res.status(500).send({msg: "잘못된 사용자입니다."});
                if (values[1].rows.length > 0) return res.status(500).send({msg: "존재하는 닉네임입니다."});
                if (values[2].rows.length > 0) return res.status(500).send({msg: "존재하는 블로그 이름입니다."});
                Promise.all([clientPromise(updateInfoSql, [req.body.nickname, req.body.passwordq, req.body.passworda, username]),
                    clientPromise(updateBlognameSql, [req.body.blogname, values[0].rows[0].user_id])])
                    .then((values2) => {
                        return res.status(200).send(`<script>alert("정보를 수정했습니다.");location.href="/userInfo"</script>`);
                    }).catch(rea => {
                    return res.status(500).send({msg: "DB Error - 1"});
                });
            }).catch(rea => {
            return res.status(500).send({msg: "DB Error"});
        });
    });
});

module.exports = router;