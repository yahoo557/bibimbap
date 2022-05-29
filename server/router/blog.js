const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const store = require('store'); // local storage
const path = require('path');
//const three = require('three');
const dt = require('../controller/decode.jwt.js');


const redirectWithMsg = require('../controller/redirectWithMsg.js');

// 내 블로그 
router.get('/myblog', (req, res) => {
    dt.decodeTokenPromise(req).then((e) => {
        const text = 'SELECT * FROM blog AS a INNER JOIN users AS b ON a.user_id = b.user_id AND b.username = $1';
        client.query(text, [e.userData.username], (err, rows) => {
            if(err) return res.status(404).send({msg: "error"});
            if(rows.rows.length < 1) return res.status(404).send("잘못된 사용자");
            return res.status(200).redirect(`/blog/${rows.rows[0].blog_id}`);
        })
    }).catch(e => {
        return redirectWithMsg(res, 401, {msg: "로그인이 필요합니다.", redirect: `/login?redirect=${encodeURIComponent("/blog/myblog")}`})
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
        const text = 'SELECT * FROM blog WHERE blog_id = $1';

        client.query(text, [blog_id], (err, rows) => {
            if(err){
                return res.send({msg:err})
            }
            const object_list = rows.rows[0].object_list;
            const expires = new Date();
            expires.setHours(expires.getHours()+24);
            return res.status(200).cookie('object_list',object_list,{expires : expires}).redirect('http://localhost:8000/client/public/mainblog/mainblog.html');
    })
})

// router.get('/', (req, res ) => {
  
// });


module.exports = router;