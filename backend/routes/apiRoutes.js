const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController'); 
const authenticateToken = require('../middleware/auth');

router.use('/cart', authenticateToken, cartController.getOrCreateCart);
router.get('/cart', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.post('/cart/remove', cartController.removeFromCart); 
router.post('/cart/clear', cartController.clearCart);     

router.post('/orders', authenticateToken, orderController.createOrder); 
router.get('/orders', authenticateToken, orderController.getOrders); 
router.get('/orders/user', authenticateToken, orderController.getUserOrders); 

router.get('/user/me', authenticateToken, userController.getMe); 
router.put('/user/me', authenticateToken, userController.updateMe);
module.exports = router;