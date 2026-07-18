const express = require('express');
const router = express.Router();
const { requireAuth, isAdmin } = require('../middlewares/authMiddleware');
const cartCtrl = require('../controllers/cartController');
const orderCtrl = require('../controllers/ordersController');

router.get('/cart', requireAuth, cartCtrl.getCart);
router.post('/cart', requireAuth, cartCtrl.addItem);
router.put('/cart', requireAuth, cartCtrl.updateItemQuantity);
router.delete('/cart/:book_id', requireAuth, cartCtrl.deleteItem);

router.post('/orders/checkout', requireAuth, orderCtrl.checkoutOrder); 
router.put('/orders/:id/status', requireAuth, isAdmin, orderCtrl.updateShippingStatus);

module.exports = router;