const express = require('express');
const router = express.Router();

const logger = require('../winston.js');

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
    nlogger.info('Noldaga API Tested');
    return res.status(200).send("hello");
});

router.post('/error', (req, res) => {
   nlogger.error('Error test');
   return res.status(500).send();
});

router.get("/get", (req, res)=>{
    return res.status(200).json("api test");
})
module.exports = router;