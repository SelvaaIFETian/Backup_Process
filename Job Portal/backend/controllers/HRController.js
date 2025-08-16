// controllers/HRController.js
const HR = require('../models/HR');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// ➕ Post a New Job

exports.register = async (req, res) => {
  const { name, company, email, password } = req.body;
  try {
    const existingHR = await HR.findOne({ where: { email } });
    if (existingHR) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hr = await HR.create({ name, company, email, password: hashedPassword });

    res.status(201).json(hr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register HR', message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hr = await HR.findOne({ where: { email } });
    if (!hr) return res.status(404).json({ message: 'HR not found' });

    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: hr.id, role: hr.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: hr });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.getAllHRs = async (req, res) => {
  try {
    const hrs = await HR.findAll();
    res.status(200).json(hrs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get HRs' });
  }
};

exports.getHRById = async (req, res) => {
  try {
    const hr = await HR.findByPk(req.params.id);
    if (!hr) return res.status(404).json({ message: 'HR not found' });
    res.status(200).json(hr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get HR' });
  }
};

exports.updateHR = async (req, res) => {
  try {
    const hr = await HR.findByPk(req.params.id);
    if (!hr) return res.status(404).json({ message: 'HR not found' });

    await hr.update(req.body);
    res.status(200).json(hr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update HR' });
  }
};

exports.deleteHR = async (req, res) => {
  try {
    const hr = await HR.findByPk(req.params.id);
    if (!hr) return res.status(404).json({ message: 'HR not found' });

    await hr.destroy();
    res.status(200).json({ message: 'HR deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete HR' });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, category, experience, type, skills, education, industry, functional_area, employment_mode } = req.body;
    const hrId = req.user.id;

    // ✅ 1. Find the HR
    const hr = await HR.findByPk(hrId);
    if (!hr) return res.status(404).json({ error: 'HR not found' });

    // ✅ 2. Create Job with company from HR
    const job = await Job.create({
      title,
      description,
      company: hr.company, // 🚨 Required field
      location,
      salary,
      category,
      experience,
      type,
      skills,
      education,
      industry,
      functional_area,
      employment_mode,
      hrId
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Create Job Error:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// 📄 View All Jobs Posted by HR
exports.getHRJobs = async (req, res) => {
  try {
    const hrId = req.user.id;
    const jobs = await Job.findAll({ where: { hrId } });
    res.status(200).json(jobs);
  } catch (err) {
    console.log(hrId);
    console.error('Fetch Jobs Error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs',err });
  }
};

// ✏️ Update a Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job || job.hrId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or Job not found' });
    }

    await job.update(req.body);
    res.status(200).json(job);
  } catch (err) {
    console.error('Update Job Error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

// 🗑 Delete a Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job || job.hrId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or Job not found' });
    }

    await job.destroy();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete Job Error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
// 👥 View Applicants for a Job
exports.getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findByPk(jobId);
    if (!job || job.hrId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized or Job not found' });
    }

    const applications = await Application.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Fetch Applicants Error:', err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

// 🔄 Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body; // Expected values: 'Pending', 'Shortlisted', 'Rejected', 'Interview'

    const application = await Application.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const job = await Job.findByPk(application.jobId);
    if (!job || job.hrId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Status updated successfully', application });
  } catch (err) {
    console.error('Update Application Status Error:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};
