const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Job = require('./Job');

const Application = sequelize.define('Application', {
    jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
status: {
  type: DataTypes.ENUM('applied', 'shortlisted', 'interview', 'accepted', 'rejected','pending'),
  defaultValue: 'applied',
},

  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
  }
});

// Relations
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = Application;
