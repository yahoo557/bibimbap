const port = 8001;

//Express.js 호출
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//app.use("/static", express.static("static"));

app.use("/api", require("./api.js"));

app.listen(port, () => {
  console.log(`[Server] - Listening on ${port}`);
});
