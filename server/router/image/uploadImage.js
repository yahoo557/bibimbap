const express = require('express');
const router = express.Router();

const client = require("../../config/db.config");
const dt = require('../../controller/decode.jwt.js');
const multer = require("multer");
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, "../../image"));
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);
            console.log(file);
            cb(null, path.basename(file.originalname, extension) + '_' + Date.now() + extension);
        }
    })
})


router.post('/', (req, res) => {
    dt.decodeTokenPromise(req).then(decode => {
        upload.single('image')(req, {}, err => {
            if(err) return res.status(500).send({msg: "Internal server error - 1"});
            const uploadQuery = 'INSERT INTO image(img_path, img_size, user_id) VALUES ($1, $2, (SELECT user_id FROM users WHERE username = $3)) RETURNING *';
            client.query(uploadQuery, [req.file.filename, req.file.size, decode.userData.username], (err, rows) => {
                if(err) return res.status(404).send({msg: "데이터베이스 오류입니다. - Block 1"});
                if(rows.rows[0].length < 1) return res.status(404).send({msg: "업로드 오류입니다."});
                return res.status(200).send({id: rows.rows[0].image_id});
            });
        });
    }).catch(rea => {
        return res.status(500).send({msg: "Internal server error"});
    });
});

module.exports = router;