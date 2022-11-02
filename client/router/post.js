const express = require('express');
const router = express.Router();

const path = require('path');

router.get('/read', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public', 'readPost.html'));
})

router.get('/write', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public', 'writePost.html'));
});

router.get('/edit', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../public', 'editPost.html'));
});

module.exports = router;