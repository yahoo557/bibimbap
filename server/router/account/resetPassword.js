const express = require("express");
const router = express.Router();

const path = require('path');
const client = require("../../config/db.config"); // DB 연결
const bcrypt = require('bcrypt');
const multer = require('multer');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'resetPassword.html'));
});


router.post('/', multer().fields([]), (req, res, next)=>{
    const getQAQuery = 'SELECT passwordq, passworda FROM users WHERE username = $1';
    const updateQuery = 'UPDATE users SET password = $1 WHERE username = $2';

    client.query(getQAQuery, [req.body.username], (err, rows) => {
        if(err) {
            return res.status(404).send({msg: "DB ERROR", redirect: '/resetPassword'})
        }
        if(rows.rows.length < 1) {
            return res.status(404).send({msg: "사용자가 존재하지 않습니다."})
        };

        if(req.body.passwordq != rows.rows[0].passwordq || req.body.passworda != rows.rows[0].passworda) {
            return res.status(403).send({msg: "비밀번호 질문 또는 답변이 일치하지 않습니다."})
        }

        if(req.body.changePassword !== req.body.confirmPassword) {
            return res.status(202).send({msg: "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다."})
        }

        const passwordExp = /^[a-zA-z0-9]{8,16}$/;
        if (!passwordExp.test(req.body.changePassword)){
            return res.status(202).send({msg: "비밀번호는 8~16자 영소/대문자 + 숫자의 조합이어야 합니다."});
        }

        const hashedPw = bcrypt.hashSync(req.body.changePassword, 10);
        client.query(updateQuery, [hashedPw, req.body.username], (err, rows) => {
            if(err) return;
            return res.status(200).send({msg: "비밀번호를 변경했습니다.", redirect: '/login'})
        })
    });
});

module.exports = router;