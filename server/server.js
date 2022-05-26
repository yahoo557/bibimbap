//Express.js 호출
const express = require("express");
const app = express();
const path = require("path");
const register = require("./router/register.js");
const login = require("./router/login.js");
const logout = require("./router/logout.js");
const post = require("./router/post.js");
const viewPost = require("./router/viewPost.js");
const resetPassword = require("./router/resetPassword.js");
const userInfo = require("./router/userInfo.js");
const postList = require("./router/postList.js");
const blog = require("./router/blog.js");

const jwt = require("jsonwebtoken");
const config = require("./config/auth.config.js");

const auth = require("./controller/auth.jwt.js");
const { verify } = require("crypto");

const dt = require('./controller/decode.jwt.js');
const client = require("./config/db.config.js");

const {createProxyMiddleware} = require('http-proxy-middleware');

const redirectWithMsg = require('./controller/redirectWithMsg.js');
const { create } = require("domain");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use("/static", express.static("static"));
app.use("/static/v2", express.static("../client"));


app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/post", post);
app.use("/postList", postList);
app.use("/viewPost", viewPost);
app.use("/resetPassword", resetPassword);
app.use("/userInfo",  userInfo);
app.use("/blog", blog);



app.use("/client", createProxyMiddleware({target:'http://127.0.0.1:5502', changeOrigin: true}));

app.get("/blog", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/mainblog", "mainblog.html"));
});

app.get("/", (req, res) => {
  const getBlogListQuery = "SELECT a.*, b.nickname FROM blog as a INNER JOIN users as b ON a.user_id = b.user_id";
  dt.decodeToken(req, (e) => {
    client.query(getBlogListQuery, [], (err, rows) => {
      if(err) return redirectWithMsg({msg: "DB Error", redirect: "/"});
      console.log(rows.rows);
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
