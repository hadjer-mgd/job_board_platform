const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recipientType: { type: DataTypes.ENUM('employer', 'candidate'), allowNull: false },
  recipientId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING }, // ex: "new_application", "status_update"
  message: { type: DataTypes.STRING, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
