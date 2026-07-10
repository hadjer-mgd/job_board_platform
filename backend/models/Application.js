const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
  candidateId: { type: DataTypes.INTEGER, allowNull: false },
  resumeId: { type: DataTypes.INTEGER, allowNull: false },
  coverLetter: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'),
    defaultValue: 'pending',
  },
  statusUpdatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'applications',
  timestamps: true,
  indexes: [{ unique: true, fields: ['jobId', 'candidateId'] }],
});

module.exports = Application;
