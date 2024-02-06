const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const bookController = require('../Controller/bookController');
const purchaseController = require('../Controller/purchaseController');
const reviewController = require('../Controller/reviewController');
const middleware = require('../Middleware/Common')


router.post('/register', userController.registerUser);
router.post('/login', userController.userLogin);

router.post('/create-book',middleware.authentication, bookController.createBook);
router.get('/filter-book', bookController.filterBooks);
router.get('/search-book', bookController.searchBooks);

router.post('/purchase',middleware.authentication, purchaseController.createPurchaseHistory);
router.get('/view-purchase/:purchaseId',middleware.authentication, purchaseController.getPurchaseHistoryByUser);
router.get('/revenue/:userId',middleware.authentication, purchaseController.getRevenueForAuthor);

router.post('/review/:bookId',middleware.authentication, reviewController.createReview);





module.exports = router;
