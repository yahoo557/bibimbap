//Express.js 호출
const express = require("express");
const app = express();


const post = require("./Router/post.js");


app.get("/", (req, res) => {
    return res.status(200).send("home")
});


const port = 8000;
app.listen(port, () => {
  console.log("listening on " + `${port}`)
}
);