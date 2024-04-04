const express = require('express');
const productsController = require("../controllers/products");
const productsMiddleware = require("../middleware/products");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', productsController.index );
router.post('/create/:id',  productsController.create );
router.patch('/update/:id', productsController.update );
router.delete('/delete/:id', productsController.delete );
router.delete('/remove/:id', productsController.remove );


module.exports = router;
