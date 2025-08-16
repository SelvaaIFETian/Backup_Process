// models/HR.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // your db instance

const HR = sequelize.define('HR', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
    phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('recruiter', 'admin'),
    defaultValue: 'recruiter',
  },
}, {
  tableName: 'hrs',
  timestamps: true,
});

module.exports = HR;
