const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const path = require('path');
//const three = require('three');
const dt = require('../controller/decode.jwt.js');

const redirectWithMsg = require('../controller/redirectWithMsg.js');

// 내 블로그 
router.get('/myblog', (req, res) => {
    dt.decodeToken(req, (e) => {
        const myblog_id = e.userData.id;
        const text = 'SELECT * FROM blog WHERE user_id = $1';
        client.query(text, [myblog_id], (err, rows) => {
            return res.send({row : rows.rows})
        })
    });
});

router.get('/test', (req, res) => {
    return res.sendFile(path.join(__dirname,'../../client/public/mainblog', 'mainblog.html'));
});

router.get('/random', (req, res) => {
    const randomBlogIdQuery = {
        logined: 'SELECT blog_id FROM blog AS a INNER JOIN users AS b ON b.username = $1 AND a.user_id <> b.user_id ORDER BY RANDOM() LIMIT 1',
        notLogined: 'SELECT blog_id FROM blog ORDER BY RANDOM() LIMIT 1'
    };
    let targetId = -1;
    dt.decodeTokenPromise(req).then((decode) => {
        if(!decode.verify) throw 'no login';
        client.query(randomBlogIdQuery.logined, [decode.userData.username], (err, rows) => {
            if(err) return res.send(`<script>alert('DB ERROR - 1');</script>`);
            targetId = rows.rows[0].blog_id;
            return res.redirect(`/blog/${targetId}`);
        });
    }).catch((e) => {
        client.query(randomBlogIdQuery.notLogined, [], (err, rows) => {
            if(err) return res.send(`<script>alert('DB ERROR - 2');</script>`);
            targetId = rows.rows[0].blog_id;
            return res.redirect(`/blog/${targetId}`);
        });
    })
});

//타인 블로그
router.get('/:id', (req, res) => {  
    const blog_id = req.params.id;
        const text = 'SELECT * FROM blog WHERE user_id = $1';
        client.query(text, [blog_id], (err, rows) => {
            return res.send({msg:blog_id})
    })
})

router.get('/', (req, res ) => {
  
});


module.exports = router;