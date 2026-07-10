const bcrypt = require('bcryptjs');
const { Candidate } = require('../models');

async function getProfile(req, res, next) {
  try {
    const candidate = await Candidate.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!candidate) return res.status(404).json({ message: 'Profil introuvable.' });
    res.json({ candidate });
  } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
  try {
    const candidate = await Candidate.findByPk(req.user.id);
    if (!candidate) return res.status(404).json({ message: 'Profil introuvable.' });

    const fields = ['firstName', 'lastName', 'phone', 'address', 'headline', 'experienceYears', 'bio'];
    fields.forEach((f) => { if (req.body[f] !== undefined) candidate[f] = req.body[f]; });
    if (req.body.skills !== undefined) candidate.skills = JSON.stringify(req.body.skills);
    if (req.body.password) candidate.password = await bcrypt.hash(req.body.password, 10);

    await candidate.save();
    const { password, ...safe } = candidate.toJSON();
    res.json({ candidate: safe });
  } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile };
