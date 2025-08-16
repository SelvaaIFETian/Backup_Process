const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// CRUD Routes

router.get('/', jobsController.getAllJobs);
router.get('/:id', jobsController.getJobById);
router.put('/:id', jobsController.updateJob);
router.delete('/:id', jobsController.deleteJob);
router.delete('/',jobsController.deleteAllJobs);

module.exports = router;
