//Express.js 호출
const express = require("express");
const app = express();

const path = require("path");
const post = require("./router/post.js");
const login = require("./router/login.js");
const register = require("./router/register.js");
const viewPost = require("./router/viewPost");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use("/static", express.static("static"));


app.use("/register", register);
app.use("/login", login);
app.use("/post", post);
app.use("/viewPost", viewPost);
app.use("/login", login);
app.use("/signup", signup);
app.use("/resetPassword", resetPassword);
app.use("/userInfo", userInfo);
app.use("/postList", postList);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'main.html'));
});


const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
}
);