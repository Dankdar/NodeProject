const express = require('express');
const ordersController = require("../controllers/orders");
const ordersMiddleware = require("../middleware/orders");
const checkAuth = require("../middleware/auth");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', ordersController.index );
router.post('/create/:id', checkAuth,  ordersController.create );
router.patch('/update/:id', checkAuth, ordersController.update );
router.delete('/delete/:id', checkAuth, ordersController.delete );
router.delete('/remove/:id', checkAuth, ordersController.remove );


module.exports = router;
