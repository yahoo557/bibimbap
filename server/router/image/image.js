const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const path = require('path');

router.use('/thumbnail', require('./thumbnail/thumbnail.js'));
router.use('/uploadImage', require('./uploadImage.js'));

router.get('/:id', (req, res) =>{
    const getNameQuery = 'SELECT img_path FROM image WHERE image_id = $1';
    client.query(getNameQuery, [req.params.id], (err, result) => {
       if(err) return res.status(500).send({msg: "DB Error"});
       if(result.rows.length < 0) return res.status(500).send({});

       return res.status(200).sendFile(path.join(__dirname, '../../image', result.rows[0].img_path));
    });
});

module.exports = router;