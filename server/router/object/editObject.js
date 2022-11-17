const express = require('express');
const router = express.Router();
const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/:id', (req, res) => {
   if (!req.body.hasOwnProperty('objectID')) return res.status(500).send({ msg: "잘못된 요청입니다." });
   const targetObjectID = req.body.objectID;

   dt.decodeTokenPromise(req).then(decode => {
      const objectId = req.params.id;
      const getBlogDataSql = 'SELECT a.* FROM blog AS a INNER JOIN users AS b ON a.user_id = b.user_id AND b.username = $1';
      client.query(getBlogDataSql, [decode.userData.username], (err, dataResult) => {
         if (err) return res.status(500).send({ msg: "DB Error" });
         if (dataResult.rows.length < 1) return res.status(500).send({ msg: "User Error" });
         if (!dataResult.rows[0].object_list.includes(targetObjectID)) return res.status(500).send({ msg: "권한이 없습니다." });
         const queryEditObject = "UPDATE model_position, model_rotaion, model_scale FROM object WHERE object_id = $1 VALUE($2, $3, $4);"
         client.query(queryEditObject, [objectId, req.body.position, req.body.rotation], (err, rows) => {
            if (err) return res.status(500).send({ msg: "DB Error - 2" });
            return res.status(200).send({ msg: "수정되었습니다." });
         });
      });
   }).catch(rea => {
      return res.status(500).send({ msg: "인증 토큰 오류입니다." });
   });

})

module.exports = router;

