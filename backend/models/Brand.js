const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Brand = sequelize.define("Brand", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  logo: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = Brand;
