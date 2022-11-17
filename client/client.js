let port = 80;
let sePort = 443;

const express = require("express"); // WAS 미들웨어
const app = express(); // 라우터 미들웨어
const app2 = express();

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const makePath = (fName) => {
    return path.join(__dirname, '/cert', fName);
}

const privateKey = (fs.existsSync(makePath('privkey.pem'))) ? fs.readFileSync(makePath('privkey.pem')) : false;
const certificate = (fs.existsSync(makePath('cert.pem'))) ? fs.readFileSync(makePath('cert.pem')) : false;
const ca = (fs.existsSync(makePath('chain.pem'))) ? fs.readFileSync(makePath('chain.pem')) : false;
const credentials = { key: privateKey, cert: certificate, ca: ca };

let httpServer = http.createServer(app2);
let httpsServer;

if(privateKey && certificate && ca) {
    httpsServer = https.createServer(credentials, app);
} else {
    httpsServer = http.createServer(app);
}

const { createProxyMiddleware } = require('http-proxy-middleware');
const proxyTarget = (process.env.NODE_ENV == "docker") ? "host.docker.internal" : "localhost"

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
    target: `http://${proxyTarget}:8001`,
    changeOrigin: true
}));

app2.get('*', (req, res) =>{
    return res.status(200).redirect("https://" + req.headers.host + req.url);
})


if(privateKey && certificate && ca) {
    httpsServer.listen(sePort, () => {
        console.log(`[Client] - Listening on ${sePort} - SECURE`);
    });
    httpServer.listen(port, () => {
        console.log(`[Client] - Listening on ${port}`);
    });
} else {
    httpsServer.listen(port, () => {
        console.log(`CAN'T FIND CERT FILES`);
        console.log(`[Client] - Listening on ${port}`);
    });
}