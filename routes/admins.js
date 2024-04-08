const express = require('express');
const adminsController = require("../controllers/admins");
const adminsMiddleware = require("../middleware/admins");
const router = express.Router();
const checkAuth = require('../middleware/auth');
const rbacMiddleware = require("../middleware/rbacMiddleware");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a admins resource');
});

router.get('/index', adminsController.index );
router.post('/register', adminsMiddleware.validate_user, adminsController.create );
router.post('/login', adminsMiddleware.validate_login , adminsController.login );
router.patch('/update/:id', checkAuth, rbacMiddleware.checkPermission('update_record'), adminsMiddleware.validate_user , adminsController.update );
router.patch('/remove/:id', checkAuth, adminsMiddleware.validate_user, rbacMiddleware.checkPermission('remove_record') , adminsController.remove );

module.exports = router;