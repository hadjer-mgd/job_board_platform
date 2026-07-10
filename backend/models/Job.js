const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employerId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    defaultValue: 'full-time',
  },
  category: { type: DataTypes.STRING }, // ex: "Développement Web", "Finance"...
  experienceLevel: {
    type: DataTypes.ENUM('junior', 'intermediate', 'senior', 'lead'),
    defaultValue: 'junior',
  },
  salaryMin: { type: DataTypes.INTEGER },
  salaryMax: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('open', 'closed'), defaultValue: 'open' },
  deadline: { type: DataTypes.DATE },
}, {
  tableName: 'jobs',
  timestamps: true,
});

module.exports = Job;
