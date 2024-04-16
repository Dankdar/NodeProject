const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const usersMiddleware = require('../middleware/users');
const checkAuth = require("../middleware/auth");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const app = express();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a users resource');
// });

// router.get('/index', usersController.index );
// router.post('/register', usersMiddleware.validate_user, usersController.create );
// router.post('/login',  usersMiddleware.validate_login , usersController.login );
// router.patch('/update/:id', checkAuth, usersMiddleware.validate_user, rbacMiddleware.checkPermission('update_record') , usersController.update );
// router.patch('/remove/:id', checkAuth, usersMiddleware.validate_user , rbacMiddleware.checkPermission('remove_record') , usersController.remove );

router.get('/', usersController.index );
router.post('/register', usersMiddleware.validateUser, usersController.create );
router.post('/login',  usersMiddleware.validateLogin , usersController.login );
router.patch('/:id', checkAuth, usersMiddleware.validateUser, rbacMiddleware.checkPermission('update_record') , usersController.update );
router.delete('/:id', checkAuth, usersMiddleware.validateUser , rbacMiddleware.checkPermission('remove_record') , usersController.remove );

module.exports = router;
