const express = require('express');
const ordersController = require("../controllers/orders");
const ordersMiddleware = require("../middleware/orders");
const checkAuth = require("../middleware/auth");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', ordersController.index );
router.post('/create/:id', checkAuth, rbacMiddleware.checkPermission('create_record'), ordersController.create );
router.patch('/update/:id', checkAuth, rbacMiddleware.checkPermission('update_record'), ordersController.update );
router.delete('/delete/:id', checkAuth, rbacMiddleware.checkPermission('delete_record'), ordersController.delete );
router.delete('/remove/:id', checkAuth, rbacMiddleware.checkPermission('remove_record'), ordersController.remove );


module.exports = router;
