//Express.js 호출
const express = require("express");
const app = express();

const path = require('path');
const post = require("./router/post.js");
const viewPost = require("./router/viewPost")

app.use("/static", express.static("static"));
app.use("/post", post);
app.use("/viewPost", viewPost);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'main.html'));
});


const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
}
);