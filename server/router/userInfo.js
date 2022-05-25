const express = require("express");
const router = express.Router();
const path = require('path');
const client = require("../config/db.config"); // DB 연결
const Query = require('pg').Query

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const dt = require('../controller/decode.jwt.js');
const { user } = require("pg/lib/defaults");

const bcrypt = require('bcrypt');
const { send } = require("process");
const { append } = require("express/lib/response");

router.get("/", (req, res) => {
    const tokenDecode = dt.decodeTokenPromise(req);
    tokenDecode.then((decode) => {
        if(!decode.verify) {
            res.status(401).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                        {msg: "인증 오류입니다.", redirect: '/'})
        }

        const reqQuery = 'SELECT user_id, nickname, passwordq, passworda FROM users WHERE username = $1';
        const blogQuery = 'SELECT * FROM blog WHERE user_id = $1';
        try {
            client.query(reqQuery, [decode.userData.username], (err, userRows) => {
                if(err) throw 'DB ERROR';
                if(userRows.rows.length < 1) throw '존재하지 않는 사용자';
    
                client.query(blogQuery, [userRows.rows[0].user_id], (err, blogRows) => {
                    if(err) throw 'DB ERROR';
                    const dataObject = Object.assign(userRows.rows[0], blogRows.rows[0]);
                    res.render(path.join(__dirname, '../public', 'userInfo.ejs'), dataObject);
                })
            });
        } catch (e) {
            return res.send(err);
        }
    });
});

router.post('/changePassword', (req, res, next) => {
    if(req.body.changePassword !== req.body.confirmPassword) {
        return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                        {msg: "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.", redirect: '/userInfo'})
    }
    const passwordExp = /^[a-zA-z0-9]{8,16}$/; 
    if (!passwordExp.test(req.body.changePassword)){
        return res.status(202).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                            {msg: "비밀번호는 8~16자 영소/대문자 + 숫자의 조합이어야 합니다.", redirect: '/userInfo'});
    }

    const tokenDecode = dt.decodeTokenPromise(req);
    tokenDecode.then((decode) => {
        if(!decode.verify) {
            res.status(401).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                        {msg: "인증 오류입니다.", redirect: '/'})
        }

        const getPwQuery = 'SELECT password FROM users WHERE username = $1';
        const updatePwQuery = 'UPDATE users SET password = $1 WHERE username = $2'
        try {
            client.query(getPwQuery, [decode.userData.username], (err, rows) => {
                if(err) throw 'DB Error';
                if(rows.rows.length < 1) throw 'Unknown user';
                if(bcrypt.compareSync(req.body.currentPassword, rows.rows[0].password)){
                    const hashedPw = bcrypt.hashSync(req.body.changePassword, 10)
                    client.query(updatePwQuery, [hashedPw, decode.userData.username], (err, rows) => {
                        if(err) throw 'DB Error';
                        return res.render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                            {msg: "비밀번호를 변경했습니다.", redirect: '/userInfo'});
                    })
                } else {
                    return res.render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                        {msg: "현재 비밀번호가 일치하지 않습니다.", redirect: '/userInfo'});
                }
            });
        } catch (e) {
            return res.send(e);
        }
    })
});

const wrapAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

router.post('/changeInfo', wrapAsync(async (req, res, next)=>{
    const tokenDecode = dt.decodeTokenPromise(req);
    tokenDecode.then((decode) => {
        if(!decode.verify) {
            res.status(401).render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                        {msg: "인증 오류입니다.", redirect: '/'})
        }

        const getIdQuery = 'SELECT user_id FROM users WHERE username = $1';
        const checkNickQuery = 'SELECT nickname FROM users WHERE nickname = $1 AND username != $2';
        const checkBlogQuery = 'SELECT blogname FROM blog WHERE blogname = $1 AND user_id != $2';
        
        const updateInfoQuery = 'UPDATE users SET nickname = $1, passwordq = $2, passworda = $3 WHERE username = $4';
        const updateBlogQuery = 'UPDATE blog SET blogname = $1 WHERE user_id = $2';


        client.query(getIdQuery, [decode.userData.username], (err, idRows) => {
            if(err) throw new Error({msg: "DB Error", redirect: '/userInfo'});
            if(idRows.rows.length < 1) throw {msg: "Unknown user", redirect: '/'};;

            client.query(checkNickQuery, [req.body.nickname, decode.userData.username], (err, nickRows) => {
                if(err) throw new Error({msg: "DB Error", redirect: '/userInfo'});
                if(nickRows.rows.length > 0) throw {msg: "이미 사용중인 닉네임입니다.", redirect: '/userInfo'};

                client.query(checkBlogQuery, [req.body.blogName, idRows.rows[0].user_id], (err, blogRows) => {
                    if(err) throw new Error({msg: "DB Error", redirect: '/userInfo'});
                    if(blogRows.rows.length > 0) throw {msg: "이미 사용중인 블로그 제목입니다.", redirect: '/userInfo'};

                    //const hashPasswordA = bcrypt.hashSync(req.body.passworda, 10);
                    client.query(updateInfoQuery, [req.body.nickname, req.body.passwordq, req.body.passworda, decode.userData.username],
                        (err, ur1) => {
                            if(err) throw new Error({msg: "DB Error", redirect: '/userInfo'});
                            client.query(updateBlogQuery, [req.body.blogName, idRows.rows[0].user_id], (err, ur2) =>{
                                if(err) throw new Error({msg: "DB Error", redirect: '/userInfo'});
                                return res.render(path.join(__dirname, '../public', 'showMsg.ejs'), 
                                {msg: "정보를 수정했습니다.", redirect: '/userInfo'});
                            });
                    });
                });
            });
        });
    })
}));

module.exports = router;