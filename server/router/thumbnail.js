const express = require('express');
const router = express.Router();

const client = require('../config/db.config.js');
const auth = require('../controller/auth.jwt.js');

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, "../thumbnail"));
        },
        filename(req, file, cb) {
            const extension = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, extension) + '_' + Date.now() + extension);
        }
    })
})

router.get('/', (req, res) => {
});

router.post('/upload', auth, upload.single('image'), (req, res) => {
    const updateQuery = 'UPDATE blog A SET thums_path = $1 FROM users B WHERE A.user_id = B.user_id AND B.username = $2';

    console.log(req.file.filename, res.locals.decode.username);
    client.query(updateQuery, [req.file.filename, res.locals.decode.username], (err, rows) => {
        if(err) {
            console.log(err)
            return res.status(404).send("err");
        }
        return res.status(200).send("done");
    })
})

router.get('/raw/:filename', (req, res) => {
    const desireFilePath = path.join(__dirname, "../thumbnail", req.params.filename);
    if(fs.existsSync(desireFilePath)) {
        return res.status(200).sendFile(desireFilePath)
    }
    return res.status(404).send();
});

module.exports = router;