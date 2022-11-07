const express = require('express');
const router = express.Router();

const path = require("path");
const fs = require("fs");

router.get('/:filename', (req, res) => {
    const desireFilePath = path.join(__dirname, "../../../thumbnail", req.params.filename);
    const defaultFilePath = path.join(__dirname, "../../../thumbnail", "defaultThumbnail.png");
    if(fs.existsSync(desireFilePath)) {
        return res.status(200).sendFile(desireFilePath)
    }
    return res.status(404).sendFile(defaultFilePath);
});

module.exports = router;