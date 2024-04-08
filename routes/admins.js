const express = require('express');
const adminsController = require("../controllers/admins");
const adminsMiddleware = require("../middleware/admins");
const router = express.Router();
const checkAuth = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a admins resource');
});

router.get('/index', adminsController.index );
router.post('/register', checkAuth, adminsMiddleware.validate_user, adminsController.create );
router.post('/login', adminsMiddleware.validate_login , adminsController.login );
router.patch('/update/:id', checkAuth, adminsMiddleware.validate_user , adminsController.update );
router.patch('/remove/:id', checkAuth, adminsMiddleware.validate_user , adminsController.remove );

module.exports = router;