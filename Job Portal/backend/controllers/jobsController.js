const Job = require('../models/Job');
const HR = require('../models/HR');



// ✅ Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
  include: {
    model: HR,
    attributes: ['id', 'name', 'company'] // include company from HR
  }
});
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

// ✅ Get Single Job
exports.getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    console.error('Fetch Job Error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

// ✅ Update Job
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.update(updateData);
    res.status(200).json(job);
  } catch (err) {
    console.error('Update Job Error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// ✅ Delete Job
exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.destroy();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete Job Error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

exports.deleteAllJobs = async (req, res) => {
  try {
    const deletedCount = await Job.destroy({
      where: {}, // no conditions = delete all
      truncate: true // resets identity (optional)
    });
    res.status(200).json({ message: 'All jobs deleted successfully', deletedCount });
  } catch (err) {
    console.error('Delete All Jobs Error:', err);
    res.status(500).json({ error: 'Failed to delete all jobs' });
  }
};