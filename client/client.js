const port = 80;

const express = require("express"); // WAS 미들웨어
const app = express(); // 라우터 미들웨어

const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

app.use("/static", express.static("static"));

// sendFile 반복용 [url, file]
const staticPageArray = [
    ["/", "main.html"],
    ["/login", "login.html"],
    ["/logout", "logout.html"],
    ["/register", "register.html"],
    ["/userInfo", "userInfo.html"],
    ["/withdraw", "withdraw.html"],
    ["/resetPassword", "resetPassword.html"]
];

staticPageArray.forEach((e) => {
    app.get(e[0], (req, res) => {
        return res.status(200).sendFile(path.join(__dirname, "/public", e[1]));
    });
});

app.use('/blog', require('./router/blog.js'));
app.use('/post', require('./router/post.js'));

app.use("/api", createProxyMiddleware({
    target: 'http://localhost:8001',
    changeOrigin: true
}));

app.listen(port, () => {
   console.log(`[Client] - Listening on ${port}`);
});