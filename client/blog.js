const express = require("express"); // WAS 미들웨어
const router = express.Router(); // 라우터 미들웨어

const Query = require('pg').Query // DB 쿼리
const client = require("../server/config/db.config.js"); // DB 연결
const store = require('store'); // local storage
const path = require('path');
//const three = require('three');
const dt = require('../server/controller/decode.jwt.js');

const redirectWithMsg = require('../server/controller/redirectWithMsg.js');
const { rows } = require("pg/lib/defaults");

router.use("/static", express.static("../client/static"));

// 내 블로그 
router.get('/my', (req, res) => {
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
        const text = 'SELECT a.*, b.nickname FROM blog AS a INNER JOIN users AS b ON a.blog_id = $1 AND a.user_id = b.user_id';
        const resArray = {
            isLogin: false,
            isOwner: false,
            blogname: '',
            nickname: ''
        }

        client.query(text, [blog_id], (err, rows) => {
            if(err){
                return res.send({msg:err})
            }
            if(rows.rows.length < 1) return res.status(404).send();
            const object_list = rows.rows[0].object_list;
            const expires = new Date();
            expires.setHours(expires.getHours()+24);
            res.cookie('object_list',object_list,{expires : expires});

            resArray.blogname = rows.rows[0].blogname;
            resArray.nickname = rows.rows[0].nickname;
            
            dt.decodeTokenPromise(req).then((decode) => {
                const idQuery = 'SELECT user_id FROM users WHERE username = $1';
                client.query(idQuery, [decode.userData.username], (err, idRows) => {
                    if(err) return;
                    if(idRows.rows.length < 1) return;
                    resArray.isLogin = true;    resArray.isOwner = (rows.rows[0].user_id == idRows.rows[0].user_id);
                    return res.status(200).render(path.join(__dirname, './public', 'blog.ejs'), resArray); 
                });
            }).catch((e) => {
                return res.status(200).render(path.join(__dirname, './public', 'blog.ejs'), resArray);
            })
            
    })
});

router.post('/place', (req, res) => {
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

    console.log(objData);

    dt.decodeTokenPromise(req).then((decode) => {   
        client.query(idQuery, [decode.userData.username], (err, idRows) => {
            if(err) return res.status(404).send('0');
            if(idRows.rows.length < 1) return res.status(404).send('1'); 
            if(idRows.rows[0].blog_id != req.body.blog_id) return res.status(404).send('2');
            client.query(insertQuery, objData, (err, upRows) => {
                if(err) return res.status(404).send(err);
                if(upRows.rows.length < 1) return res.status(404).send('4'); 
                client.query(updateQuery, [upRows.rows[0].object_id, idRows.rows[0].blog_id], (err, rows) => {
                    if(err) return res.status(404).send(err);
                    return res.status(200).send();
                })       
            })
        })
    }).catch((e) => {
        console.log(e)
        return res.status(404).send()
    });
});


module.exports = router;