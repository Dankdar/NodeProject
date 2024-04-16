const express = require('express');
const adminsController = require("../controllers/admins");
const adminsMiddleware = require("../middleware/admins");
const router = express.Router();
const checkAuth = require('../middleware/auth');
const rbacMiddleware = require("../middleware/rbacMiddleware");


router.get('/', adminsController.index );
router.post('/register', adminsMiddleware.validateUser, adminsController.create );
router.post('/login', adminsMiddleware.validateLogin , adminsController.login );
router.patch('/:id', checkAuth,adminsMiddleware.validateUser, rbacMiddleware.checkPermission('update_record'), adminsController.update );
router.delete('/:id', checkAuth, adminsMiddleware.validateUser, rbacMiddleware.checkPermission('remove_record') , adminsController.remove );

module.exports = router;