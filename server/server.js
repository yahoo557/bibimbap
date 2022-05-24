//Express.js 호출
const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const register = require("./router/register.js");
const login = require("./router/login.js");
const logout = require("./router/logout.js");
const post = require("./router/post.js");
const viewPost = require("./router/viewPost");
const resetPassword = require("./router/resetPassword");
const userInfo = require("./router/userInfo");
const postList = require("./router/postList.js");
const blog = require("./router/blog.js");


const jwt = require("jsonwebtoken");
const config = require("./config/auth.config.js");

const auth = require("./controller/auth.jwt.js");
const { verify } = require("crypto");

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use("/static", express.static("static"));

app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/post", post);
app.use("/postList",  postList);
app.use("/viewPost",  viewPost);
app.use("/resetPassword",auth,   resetPassword);
app.use("/userInfo",auth, userInfo);

app.get("/", (req, res) => {
  var token = ''
  if(req.headers.cookie){
    const parseCookie = str =>
    str.split(';').map(v => v.split('=')).reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
   token = parseCookie(req.headers.cookie).accessToken;    
  }
  const verify = jwt.verify(token, config.secret,(err, decoded) => {
    if (err) {
      return "false";
    }
    return "true";
  }); 
  res.render(path.join(__dirname, '/public', 'main.ejs'), {isLogined : verify});
});

const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
});
