const jwt = require('jsonwebtoken');
const HR = require('../models/HR');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hr = await HR.findByPk(decoded.id);
    if (!hr) return res.status(401).json({ error: 'Unauthorized' });

    req.user = hr;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
