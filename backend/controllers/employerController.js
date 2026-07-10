const bcrypt = require('bcryptjs');
const { Employer } = require('../models');

async function getProfile(req, res, next) {
  try {
    const employer = await Employer.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!employer) return res.status(404).json({ message: 'Profil introuvable.' });
    res.json({ employer });
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const employer = await Employer.findByPk(req.user.id);
    if (!employer) return res.status(404).json({ message: 'Profil introuvable.' });

    const fields = ['companyName', 'phone', 'website', 'address', 'industry', 'logoUrl', 'description'];
    fields.forEach((f) => { if (req.body[f] !== undefined) employer[f] = req.body[f]; });
    if (req.body.password) employer.password = await bcrypt.hash(req.body.password, 10);

    await employer.save();
    const { password, ...safe } = employer.toJSON();
    res.json({ employer: safe });
  } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile };
