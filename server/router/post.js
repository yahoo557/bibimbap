const express = require("express");
const router = express.Router();
// const Quill = require("quill");

router.get("/", (req, res) => {
    res.sendFile('/Users/seungbaek/Desktop/Graduation_work/server/public/post.html');
});

module.exports = router;
