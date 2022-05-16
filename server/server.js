//Express.js 호출
const express = require("express");
const app = express();

const path = require("path");
const post = require("./router/post.js");
const viewPost = require("./router/viewPost");
const login = require("./router/login.js");
const signup = require("./router/signup.js");
const resetPassword = require("./router/resetPassword.js");
const userInfo = require("./router/userInfo.js");
const postList = require("./router/postList.js");

app.use(express.json());

app.use("/static", express.static("static"));
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