const bcrypt = require('bcryptjs');
const { Employer, Candidate, Admin } = require('../models');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

function sanitize(instance) {
  const obj = instance.toJSON();
  delete obj.password;
  return obj;
}

// --- Inscription candidat ---
async function registerCandidate(req, res, next) {
  try {
    const { firstName, lastName, email, password, phone, headline, skills, experienceYears } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }
    const existing = await Candidate.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Cet email est déjà utilisé.' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const candidate = await Candidate.create({
      firstName, lastName, email, password: hashed, phone, headline,
      skills: skills ? JSON.stringify(skills) : null,
      experienceYears: experienceYears || 0,
    });

    const token = generateToken({ id: candidate.id, role: 'candidate' });
    res.status(201).json({ token, user: sanitize(candidate), role: 'candidate' });
  } catch (err) { next(err); }
}

// --- Inscription employeur ---
async function registerEmployer(req, res, next) {
  try {
    const { companyName, email, password, phone, website, address, industry, description } = req.body;
    if (!companyName || !email || !password) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }
    const existing = await Employer.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Cet email est déjà utilisé.' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const employer = await Employer.create({
      companyName, email, password: hashed, phone, website, address, industry, description,
    });

    const token = generateToken({ id: employer.id, role: 'employer' });
    res.status(201).json({ token, user: sanitize(employer), role: 'employer' });
  } catch (err) { next(err); }
}

// --- Connexion unifiée (candidate / employer / admin) ---
async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, mot de passe et rôle sont requis.' });
    }

    const Model = { candidate: Candidate, employer: Employer, admin: Admin }[role];
    if (!Model) return res.status(400).json({ message: 'Rôle invalide.' });

    const user = await Model.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const token = generateToken({ id: user.id, role });
    res.json({ token, user: sanitize(user), role });
  } catch (err) { next(err); }
}

// --- Profil courant ---
async function me(req, res, next) {
  try {
    const { id, role } = req.user;
    const Model = { candidate: Candidate, employer: Employer, admin: Admin }[role];
    const user = await Model.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json({ user: sanitize(user), role });
  } catch (err) { next(err); }
}

module.exports = { registerCandidate, registerEmployer, login, me };
