const { Notification } = require('../models');

async function listMyNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { recipientType: req.user.role, recipientId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json({ notifications });
  } catch (err) { next(err); }
}

async function markAsRead(req, res, next) {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (!notif || notif.recipientId !== req.user.id || notif.recipientType !== req.user.role) {
      return res.status(404).json({ message: 'Notification introuvable.' });
    }
    notif.isRead = true;
    await notif.save();
    res.json({ notification: notif });
  } catch (err) { next(err); }
}

async function markAllAsRead(req, res, next) {
  try {
    await Notification.update(
      { isRead: true },
      { where: { recipientType: req.user.role, recipientId: req.user.id } }
    );
    res.json({ message: 'Toutes les notifications ont été marquées comme lues.' });
  } catch (err) { next(err); }
}

module.exports = { listMyNotifications, markAsRead, markAllAsRead };
