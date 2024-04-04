const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a admins resource');
});

module.exports = router;