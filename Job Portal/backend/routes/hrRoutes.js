// routes/hrRoutes.js
const express = require('express');
const router = express.Router();
const hrController = require('../controllers/HRController');
const authenticateHR = require('../middleware/authenticateHR'); 



// Routes
router.post('/register', hrController.register);
router.post('/login', hrController.login);

router.get('/', hrController.getAllHRs);

router.use(authenticateHR);
router.post('/jobs', hrController.createJob);
router.get('/jobs', hrController.getHRJobs);
router.put('/jobs/:id', hrController.updateJob);
router.delete('/jobs/:id', hrController.deleteJob);
router.get('/jobs/:id/applicants', hrController.getApplicants);
router.put('/applications/:id/status', hrController.updateApplicationStatus);
router.get('/:id', hrController.getHRById);
router.put('/:id', hrController.updateHR);
router.delete('/:id', hrController.deleteHR);

module.exports = router;
