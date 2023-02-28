const express = require('express');
const router = express.Router();
const path = require('path');

const index_page = path.join(__dirname, '../public/index.html');

router.get("/", function(req, res){
    res.status(200);
    res.type('text/html');
    res.sendFile(index_page);
    // res.send('<h1>Hello Express.js</h1>');
})

module.exports = router;