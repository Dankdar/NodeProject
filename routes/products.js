const express = require('express');
const productsController = require("../controllers/products");
const productsMiddleware = require("../middleware/products");
const checkAuth = require("../middleware/auth");
const router = express.Router();

/* GET product listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a products resource');
});

router.get('/index', productsController.index );
router.post('/create/:id', checkAuth,  productsController.create );
router.patch('/update/:id', checkAuth, productsController.update );
router.delete('/delete/:id', checkAuth, productsController.delete );
router.delete('/remove/:id', checkAuth, productsController.remove );


module.exports = router;
