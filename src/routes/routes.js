const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const bookController = require('../Controller/bookController');


router.post('/register', userController.registerUser);
router.post('/login', userController.userLogin);

router.post('/create-book', bookController.createBook);



module.exports = router;
