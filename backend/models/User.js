  // models/User.js
  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/db');


  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
  }, { timestamps: true });

  module.exports = User;
