const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Employer = sequelize.define('Employer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  logoUrl: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
}, {
  tableName: 'employers',
  timestamps: true,
});

module.exports = Employer;
