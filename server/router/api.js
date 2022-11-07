const express = require('express');
const router = express.Router();

// router 정리 [url, requireRouter]
const routers = [
    ['/account', './account/account.js'],
    ['/blog', './blog/blog.js'],
    ['/object', './object/object.js'],
    ['/post', './post/post.js'],
    ['/image', './image/image.js'],
    ['/search', './search/search.js']
]

routers.forEach(k => {
    router.use(k[0], require(k[1]));
})

router.post("/", (req, res) => {
    return res.status(200).send("hello");
});

router.get("/get", (req, res)=>{
    return res.status(200).json("api test");
})
module.exports = router;