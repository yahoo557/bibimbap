const express = require("express");
const router = express.Router();
// const Quill = require("quill");

const path = require('path');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'post.html'));
});

module.exports = router;