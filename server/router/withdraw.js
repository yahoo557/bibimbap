const express = require('express');
const router = express.Router();

const client = require('../config/db.config.js');
const dt = require('../controller/decode.jwt.js');

const bcrypt = require('bcrypt');

const auth = require('../controller/auth.jwt.js');
const path = require('path');

router.get('/', auth, (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, "../public", "withdraw.html"));
});

router.post('/', (req, res) => {
    const getUserQuery = "SELECT * FROM users WHERE username = $1";
    const delQuery = `DELETE FROM users WHERE user_id = $1`;
    
    dt.decodeTokenPromise(req).then((decode) => {
        if(!decode.verify) {
            throw '';
        }
        
        client.query(getUserQuery, [decode.userData.username], (err, userRows) => {
            if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 1"});
            if(userRows.rows.length < 1) return res.status(202).send({msg: "잘못된 사용자입니다."});
            if(!bcrypt.compareSync(req.body.password, userRows.rows[0].password)) return res.status(401).send({msg: "비밀번호가 다릅니다."});
            
            client.query(delQuery,[userRows.rows[0].user_id], (err, delRows) => {
                if(err){
                    console.log(err);
                    return res.status(404).send({msg: "데이터베이스 오류 - Block 2"});
                }
                return res.status(200).send({msg: "정상적으로 탈퇴되었습니다.", redirect: "/logout"})
            });
        });
    }).catch((e) => {
        return res.status(401).send({msg: "로그인이 필요합니다.", redirect: `/login?redirect=${encodeURIComponent("/withdraw")}`});
    })
});

module.exports = router;