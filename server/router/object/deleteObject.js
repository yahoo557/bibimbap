const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');
const dt = require('../../controller/decode.jwt.js');

router.post('/', (req, res) => {
   if(!req.body.hasOwnProperty('objectID')) return res.status(500).send({msg: "잘못된 요청입니다."});

   const targetObjectID = req.body.objectID;

   dt.decodeTokenPromise(req).then(decode => {
      const getBlogDataSql = 'SELECT a.* FROM blog AS a INNER JOIN users AS b ON a.user_id = b.user_id AND b.username = $1';
      client.query(getBlogDataSql, [decode.userData.username], (err, dataResult) => {
         if(err) return res.status(500).send({msg: "DB Error"});
         if(dataResult.rows.length < 1) return res.status(500).send({msg: "User Error"});

         if(!dataResult.rows[0].object_list.includes(targetObjectID)) return res.status(500).send({msg: "권한이 없습니다."});

         const deleteSql = 'DELETE FROM object WHERE object_id = $1';
         const updateSql = 'UPDATE blog SET object_list = $1 WHERE blog_id = $2';

         const objectList = dataResult.rows[0].object_list;
         objectList.splice(objectList.indexOf(targetObjectID), 1);

         client.query(deleteSql, [targetObjectID], err => {
            if(err) return res.status(500).send({msg: "DB Error - 1"});
            client.query(updateSql, [objectList, dataResult.rows[0].blog_id], err => {
               if(err) return res.status(500).send({msg: "DB Error - 2"});
               return res.status(200).send({msg: "삭제되었습니다."});
            });
         });
      });

   }).catch(rea => {
      return res.status(500).send({msg: "인증 토큰 오류입니다."});
   });
});

module.exports = router;