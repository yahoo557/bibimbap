const express = require('express');
const router = express.Router();
const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/', (req, res) => {
    if(!req.body.hasOwnProperty('objectID')) return res.status(500).send({msg: "잘못된 요청입니다."});
    const targetObjectID = req.body.objectID;

    // dt.decodeTokenPromise(req).then(decode => {

    // })
    const queryEditObject = "UPDATE object SET model_position = $1 , model_rotation = $2 , scale = $3 WHERE object_id = $4 returning *;"
    client.query(queryEditObject, [req.body.position, req.body.rotation, req.body.scale, targetObjectID], (err, rows)=>{
        if(err){
            console.log(err)
        }
        else{
            return res.status(200).json({msg: "수정되었습니다."});
        }
    });
})

module.exports = router;

