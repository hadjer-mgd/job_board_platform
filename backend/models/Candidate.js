const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  headline: { type: DataTypes.STRING }, // ex: "Développeur Full-Stack Laravel"
  skills: { type: DataTypes.TEXT }, // stocké en JSON string, ex: ["PHP","Laravel","React"]
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 },
  bio: { type: DataTypes.TEXT },
}, {
  tableName: 'candidates',
  timestamps: true,
});

module.exports = Candidate;
