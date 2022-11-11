const port = 8001;

//Express.js 호출
const express = require("express");
const app = express();

//Logger
global.nlogger = require('./winston.js');
const morgan = require('morgan');
morgan.token('addr', req => {
    return req.headers['x-forwarded-for'];
});

const morganFormat = ':method :url :status :res[content-length] - :response-time ms | From - :addr'
app.use(morgan(morganFormat, {stream: nlogger.stream}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//app.use("/static", express.static("static"));

app.use("/api", require("./router/api.js"));

app.listen(port, () => {
    nlogger.info("Server Opened / PORT : " + port);
});
