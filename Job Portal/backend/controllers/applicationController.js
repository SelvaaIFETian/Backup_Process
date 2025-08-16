const Application = require('../models/Application');
const Job = require('../models/Job');

// 📨 Apply for a job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;
    const userId = req.user?.id;

    console.log("Incoming Apply Request:", { userId, jobId, resumeUrl });

    if (!userId || !jobId || !resumeUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await Application.findOne({ where: { userId, jobId } });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      userId,
      resumeUrl,
      coverLetter,
    });

    console.log('Application Created:', application);

    res.status(201).json({ message: 'Application submitted', application });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
};

// 📄 View user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.findAll({
      where: { userId },
      include: [{ model: Job }]
    });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
