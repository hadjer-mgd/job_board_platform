const bcrypt = require('bcryptjs');
const { Employer, Candidate, Job, Application, Admin, sequelize } = require('../models');

// --- Statistiques globales pour le tableau de bord admin ---
async function getStats(req, res, next) {
  try {
    const [totalEmployers, totalCandidates, totalJobs, openJobs, totalApplications] = await Promise.all([
      Employer.count(),
      Candidate.count(),
      Job.count(),
      Job.count({ where: { status: 'open' } }),
      Application.count(),
    ]);

    const applicationsByStatus = await Application.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
    });

    const jobsByType = await Job.findAll({
      attributes: ['jobType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['jobType'],
    });

    const topEmployers = await Job.findAll({
      attributes: ['employerId', [sequelize.fn('COUNT', sequelize.col('Job.id')), 'jobCount']],
      include: [{ model: Employer, as: 'employer', attributes: ['companyName'] }],
      group: ['employerId', 'employer.id'],
      order: [[sequelize.literal('jobCount'), 'DESC']],
      limit: 5,
    });

    res.json({
      totals: { totalEmployers, totalCandidates, totalJobs, openJobs, totalApplications },
      applicationsByStatus,
      jobsByType,
      topEmployers,
    });
  } catch (err) { next(err); }
}

// --- Gestion des utilisateurs ---
async function listEmployers(req, res, next) {
  try {
    const employers = await Employer.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json({ employers });
  } catch (err) { next(err); }
}

async function listCandidates(req, res, next) {
  try {
    const candidates = await Candidate.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json({ candidates });
  } catch (err) { next(err); }
}

async function listAllJobs(req, res, next) {
  try {
    const jobs = await Job.findAll({
      include: [{ model: Employer, as: 'employer', attributes: ['companyName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ jobs });
  } catch (err) { next(err); }
}

async function deleteEmployer(req, res, next) {
  try {
    const employer = await Employer.findByPk(req.params.id);
    if (!employer) return res.status(404).json({ message: 'Employeur introuvable.' });
    await employer.destroy();
    res.json({ message: 'Employeur supprimé.' });
  } catch (err) { next(err); }
}

async function deleteCandidate(req, res, next) {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidat introuvable.' });
    await candidate.destroy();
    res.json({ message: 'Candidat supprimé.' });
  } catch (err) { next(err); }
}

async function deleteJobAdmin(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre introuvable.' });
    await job.destroy();
    res.json({ message: 'Offre supprimée.' });
  } catch (err) { next(err); }
}

// --- Inscription admin (à utiliser une seule fois / via seed) ---
async function registerAdmin(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Admin déjà existant.' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Admin créé.', admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (err) { next(err); }
}

module.exports = {
  getStats, listEmployers, listCandidates, listAllJobs,
  deleteEmployer, deleteCandidate, deleteJobAdmin, registerAdmin,
};
