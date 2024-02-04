const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const bookController = require('../Controller/bookController');
const purchaseController = require('../Controller/purchaseController');


router.post('/register', userController.registerUser);
router.post('/login', userController.userLogin);

router.post('/create-book', bookController.createBook);
router.get('/filter-book', bookController.filterBooks);

router.post('/purchase/:userId', purchaseController.createPurchaseHistory);
router.get('/view-purchase/:userId', purchaseController.getPurchaseHistoryByUser);





module.exports = router;
