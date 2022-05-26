const { redirect } = require('express/lib/response');
const path = require('path');
const ejsPath = path.join(__dirname, '../public', 'showMsg.ejs');

redirectWithMsg = (res, statusCode, data) => {
    res.status(statusCode).render(ejsPath, data);
}

module.exports = redirectWithMsg;