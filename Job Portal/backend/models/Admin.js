// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // adjust if path differs

const Admin = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  status: {
  type: DataTypes.STRING,
  defaultValue: 'active',
  allowNull: false
}
,
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Admin;
