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

const auth = require("./controller/auth.jwt.js");


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
    res.render(path.join(__dirname, '/public', 'main.ejs'));
});


const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
});
