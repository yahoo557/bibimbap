const express = require('express');
const router = express.Router();

// router 정리 [url, requireRouter]
const routers = [
    ['/account', './router/account/account.js'],
    ['/blog', './router/blog/blog.js'],
    ['/object', './router/object/object.js'],
    ['/post', './router/post/post.js']
]

routers.forEach(k => {
    router.use(k[0], require(k[1]));
})

router.post("/", (req, res) => {
    return res.status(200).send("hello");
});

module.exports = router;