const express = require('express');
const router = express.Router();
const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/:id', (req, res) => {
    const objectId = req.params.id;
    const queryEditObject = "UPDATE model_position, model_rotaion, model_scale FROM object WHERE object_id = $1 VALUE($2, $3, $4);"
    client.query(queryEditObject, [objectId, req.body.position, req.body.rotation], (err, rows)=>{
        
    })
})

module.exports = router;