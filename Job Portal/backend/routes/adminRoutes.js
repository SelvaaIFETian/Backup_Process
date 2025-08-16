// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/adminAuthController');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');


router.post('/register', authController.adminRegister);
router.post('/login', authController.adminLogin);


router.get('/users', adminAuth, adminController.getAllUsers);
router.patch('/user/:id/block', adminAuth, adminController.toggleBlockUser);
router.delete('/user/:id', adminAuth, adminController.deleteUser);

module.exports = router;
