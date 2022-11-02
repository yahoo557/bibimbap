const express = require('express');
const router = express.Router();

const client = require('../../config/db.config.js');

router.post('/', (req, res) => {
   if(!req.body.hasOwnProperty('blog_id')) {
      return res.status(404).send();
   }
   const blog_id = req.body.blog_id;
   const getBlogDataQuery = 'SELECT a.*, b.nickname, b.username FROM blog AS a INNER JOIN users AS b ON a.blog_id = $1 AND a.user_id = b.user_id';

   client.query(getBlogDataQuery, [blog_id], (err, blogDataRows) => {
      if(err || blogDataRows.rows.length < 1) return res.status(500).send();
      return res.status(200).send(blogDataRows.rows[0]);
   });
});

module.exports = router;