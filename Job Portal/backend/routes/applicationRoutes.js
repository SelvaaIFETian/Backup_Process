const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticateToken = require('../middleware/authMiddleware');
// const authenticateUser = require('../middleware/authenticateUser'); // JWT middleware for normal users

// router.use(authenticateUser);

// 📨 Apply to a job
router.post('/apply',authenticateToken, applicationController.applyToJob);

// 📄 View my applications
router.get('/my-applications',authenticateToken, applicationController.getMyApplications);

module.exports = router;
