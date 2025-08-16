// models/Job.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const HR = require('./HR'); // Import the HR model for association

const Job = sequelize.define('Job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Full-time'
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true
  },
  education: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  functional_area: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employment_mode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Jobs',
  timestamps: true,
  freezeTableName: true
});

// 👇 Association: Each Job is posted by one HR
Job.belongsTo(HR, {
  foreignKey: {
    name: 'hrId', // replaces 'posted_by'
    allowNull: false
  },
  onDelete: 'CASCADE'
});

HR.hasMany(Job, {
  foreignKey: 'hrId'
});

module.exports = Job;
