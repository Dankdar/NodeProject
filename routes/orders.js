const express = require('express');
const ordersController = require("../controllers/orders");
const ordersMiddleware = require("../middleware/orders");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', ordersController.index );
router.post('/create/:id',  ordersController.create );
router.patch('/update/:id', ordersController.update );
router.delete('/delete/:id', ordersController.delete );
router.delete('/remove/:id', ordersController.remove );


module.exports = router;
