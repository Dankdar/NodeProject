const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const usersMiddleware = require('../middleware/users');
const checkAuth = require("../middleware/auth");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const app = express();


router.get('/', usersController.index );
router.post('/register', usersMiddleware.validateUser, usersController.create );
router.post('/login',  usersMiddleware.validateLogin , usersController.login );
router.patch('/:id', checkAuth, usersMiddleware.validateUser, rbacMiddleware.checkPermission('update_record') , usersController.update );
router.delete('/:id', checkAuth, usersMiddleware.validateUser , rbacMiddleware.checkPermission('remove_record') , usersController.remove );

module.exports = router;
