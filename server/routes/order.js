const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.post('/checkout', orderController.checkout);

module.exports = router;