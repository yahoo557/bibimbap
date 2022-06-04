//Express.js 호출
const express = require("express");
const app = express();

//library middlewares
const path = require("path");
const { verify } = require("crypto");
const { create } = require("domain");

//custom middlewares & contollers
const dt = require('./controller/decode.jwt.js');
const client = require("./config/db.config.js");
const redirectWithMsg = require('./controller/redirectWithMsg.js');

// router 정리 [url, requireRouter]
const routers = [
  ['/register', './router/register.js'],
  ['/login', './router/login.js'],
  ['/logout', './router/logout.js'],
  ['/post', './router/post.js'],
  ['/postList', './router/postList.js'],
  ['/viewPost', './router/viewPost.js'],
  ['/resetPassword', './router/resetPassword.js'],
  ['/userInfo', './router/userInfo.js'],
  ['/blog', '../client/blog.js'],
  ['/image', './router/image.js'],
  ['/getPostByObject', './router/getPostByObject.js'],
  ['/duplicateCheck', './router/duplicateCheck.js'],
  ['/getObject', './router/getObject.js'],
  ['/getObjectById', './router/getObjectById.js'],
  ['/withdraw', './router/withdraw.js'],
  ['/search', './router/search.js'],
  ['/thumbnail', './router/thumbnail.js']
]

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use("/static", express.static("static"));

routers.forEach(k => {
  app.use(k[0], require(k[1]));
})

app.get("/", (req, res) => {
  const getBlogListQuery = "SELECT a.*, b.nickname FROM blog as a INNER JOIN users as b ON a.user_id = b.user_id ORDER BY RANDOM()";

  dt.decodeToken(req, (e) => {
    client.query(getBlogListQuery, [], (err, rows) => {
      if(err) return redirectWithMsg(res, 404, {msg: "DB Error", redirect: "/"});
      res.render(path.join(__dirname, '/public', 'main.ejs'), {isLogined : e.verify, nickname: (e.verify) ? e.cookie.user : "", blogData: JSON.stringify(rows.rows)});  

    });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pagenotfound.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send(path.join(__dirname, '../public', 'showMsg.ejs'), err);
});

const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
});
