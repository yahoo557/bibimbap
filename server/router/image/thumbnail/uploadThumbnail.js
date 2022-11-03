const express = require('express');
const router = express.Router();

const client = require('../../../config/db.config.js');
const dt = require('../../../controller/decode.jwt.js');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, "../../../thumbnail"));
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, extension) + '_' + Date.now() + '.png');
        }
    })
});

router.post('/', (req, res) => {
    dt.decodeTokenPromise(req).then(decode => {
        upload.single('image')(req, {}, err => {
            if(err) return res.status(500).send({msg: "Internal server error"});
            const updateQuery = 'UPDATE blog A SET thums_path = $1 FROM users B WHERE A.user_id = B.user_id AND B.username = $2';

            client.query(updateQuery, [req.file.filename, decode.userData.username], (err, result) => {
               if(err) return res.status(500).send({msg: "DB Error"});
               return res.status(200).send();
            });
        });
    }).catch(rea => {
       return res.status(500).send({msg: "Internal server error"});
    });
});

module.exports = router;