const express = require('express');
const productsController = require("../controllers/products");
const productsMiddleware = require("../middleware/products");
const checkAuth = require("../middleware/auth");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', productsController.index );
router.post('/create/:id', checkAuth, rbacMiddleware.checkPermission('create_record'), productsController.create );
router.patch('/update/:id', checkAuth, rbacMiddleware.checkPermission('update_record'), productsController.update );
router.delete('/delete/:id', checkAuth, rbacMiddleware.checkPermission('delete_record'), productsController.delete );
router.delete('/remove/:id', checkAuth, rbacMiddleware.checkPermission('remove_record'), productsController.remove );


module.exports = router;
