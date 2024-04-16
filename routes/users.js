const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const usersMiddleware = require('../middleware/users');
const checkAuth = require("../middleware/auth");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const multer = require('multer');
const app = express();
const storage = multer.diskStorage({ // Set up multer for file uploads
    destination: function (req, file, cb) {
        cb(null, 'public/storage/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    // fileFilter: (req, file, cb) => {
    //     if (file.fieldname === 'avatar') {
    //         cb(null, true);
    //     } else {x
    //         cb(new Error('Unexpected field'));
    //     }
    // }
});

const upload = multer({ storage: storage });

router.get('/', usersController.index );
router.post('/register', usersMiddleware.validateUser, usersController.create );
router.post('/login',  usersMiddleware.validateLogin , usersController.login );
router.patch('/:id', checkAuth, usersMiddleware.validateUser, rbacMiddleware.checkPermission('update_record') , usersController.update );
router.delete('/:id', checkAuth, usersMiddleware.validateUser , rbacMiddleware.checkPermission('remove_record'), usersController.remove );


router.post('/add-bulk', checkAuth, upload.single('excelFile'), rbacMiddleware.checkPermission('create_record') , usersController.addBulkUser );

module.exports = router;
