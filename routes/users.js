const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const usersMiddleware = require('../middleware/users');
const app = express();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a users resource');
});

router.get('/index', usersController.index );
router.post('/register',  usersMiddleware.validate_user, usersController.create );
router.post('/login',  usersMiddleware.validate_login , usersController.login );
router.patch('/update/:id',  usersMiddleware.validate_user , usersController.update );
router.patch('/remove/:id',  usersMiddleware.validate_user , usersController.remove );

module.exports = router;
