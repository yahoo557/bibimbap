const express = require('express');
const router = express.Router();

const Query = require('pg').Query // DB 쿼리
const client = require("../config/db.config"); // DB 연결
const path = require('path');
const fs = require('fs');

const multer = require('multer');

const dt = require('../controller/decode.jwt.js');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, "../image"));
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, extension) + '_' + Date.now() + extension);
        }
    })
})

const auth = (req, res, next) => {
    dt.decodeTokenPromise(req).then((decode) => {
        res.locals.username = decode.userData.username;
        next();
    }).catch((e) => {
        return res.send({msg: "로그인이 필요합니다."});
    });
}

router.post('/upload', auth, upload.single('image'), (req, res) => {
    const uploadQuery = 'INSERT INTO image(img_path, img_size, user_id) VALUES ($1, $2, (SELECT user_id FROM users WHERE username = $3)) RETURNING *';
    client.query(uploadQuery, [req.file.filename, req.file.size, res.locals.username], (err, rows) => {
        if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
        if(rows.rows[0].length < 1) return res.status(404).send({msg: "업로드 오류입니다."});
        return res.status(200).send({id: rows.rows[0].image_id});
    });
});

router.post('/delete/:id', (req, res) => {
    const deleteQuery = "DELETE FROM image WHERE image_id = $1 AND user_id = (SELECT user_id FROM users WHERE username = $2) RETURNING *"

    dt.decodeTokenPromise(req).then((decode) => {
        client.query(deleteQuery, [req.params.id, decode.userData.username], (err, rows) => {
            if(err) return res.status(404).send({msg: "데이터베이스 오류 - Block 1"});
            if(rows.rows.length < 1) return res.status(202).send({msg: "접근 오류"});
            return res.status(200).send({msg: "삭제 성공"});
        })
    }).catch(() => {
        return res.status(202).send({msg: "로그인이 필요합니다."})
    })
});

router.get('/raw/:id', (req, res) => {
    const getQuery = "SELECT img_path FROM image WHERE image_id = $1";
    client.query(getQuery, [req.params.id], (err, rows) => {
        if(err) return res.status(404).send();
        if(rows.rows.length < 1) return res.status(404).send();
        fs.access(path.join(__dirname, '../image', rows.rows[0].img_path), fs.F_OK, (err) => {
            if(err) return res.status(404).send();
            return res.sendFile(path.join(__dirname, '../image', rows.rows[0].img_path));
        });
    })
})

module.exports = router;
