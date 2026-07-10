// Petit helper centralisant la création de notifications internes.
// Dans une vraie prod, on pourrait brancher ici un envoi d'email (nodemailer) etc.
const { Notification } = require('../models');

async function notify({ recipientType, recipientId, type, message }) {
  return Notification.create({ recipientType, recipientId, type, message });
}

module.exports = { notify };
