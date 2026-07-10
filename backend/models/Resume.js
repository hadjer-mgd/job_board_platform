const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resume = sequelize.define('Resume', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING },
  isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'resumes',
  timestamps: true,
});

module.exports = Resume;
