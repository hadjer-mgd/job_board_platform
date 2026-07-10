const { Op } = require('sequelize');
const { Job, Employer, Application } = require('../models');

// --- Créer une offre (employeur) ---
async function createJob(req, res, next) {
  try {
    const employerId = req.user.id;
    const { title, description, requirements, location, jobType, category, experienceLevel, salaryMin, salaryMax, deadline } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Le titre et la description sont obligatoires.' });
    }

    const job = await Job.create({
      employerId, title, description, requirements, location, jobType, category,
      experienceLevel, salaryMin, salaryMax, deadline,
    });

    res.status(201).json({ job });
  } catch (err) { next(err); }
}

// --- Modifier une offre (employeur propriétaire) ---
async function updateJob(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre introuvable.' });
    if (job.employerId !== req.user.id) return res.status(403).json({ message: 'Action non autorisée.' });

    const fields = ['title', 'description', 'requirements', 'location', 'jobType', 'category', 'experienceLevel', 'salaryMin', 'salaryMax', 'status', 'deadline'];
    fields.forEach((f) => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
    await job.save();

    res.json({ job });
  } catch (err) { next(err); }
}

// --- Supprimer une offre ---
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre introuvable.' });
    if (job.employerId !== req.user.id) return res.status(403).json({ message: 'Action non autorisée.' });

    await job.destroy();
    res.json({ message: 'Offre supprimée.' });
  } catch (err) { next(err); }
}

// --- Détail d'une offre (public) ---
async function getJob(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Employer, as: 'employer', attributes: ['id', 'companyName', 'logoUrl', 'website', 'industry', 'address'] }],
    });
    if (!job) return res.status(404).json({ message: 'Offre introuvable.' });
    res.json({ job });
  } catch (err) { next(err); }
}

// --- Recherche / liste des offres avec filtres (public) ---
async function listJobs(req, res, next) {
  try {
    const {
      keyword, location, jobType, category, experienceLevel,
      salaryMin, salaryMax, status, page = 1, limit = 10,
    } = req.query;

    const where = {};
    where.status = status || 'open';

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (jobType) where.jobType = jobType;
    if (category) where.category = { [Op.like]: `%${category}%` };
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (salaryMin) where.salaryMax = { [Op.gte]: Number(salaryMin) };
    if (salaryMax) where.salaryMin = { [Op.lte]: Number(salaryMax) };

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Job.findAndCountAll({
      where,
      include: [{ model: Employer, as: 'employer', attributes: ['id', 'companyName', 'logoUrl', 'industry'] }],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      jobs: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (err) { next(err); }
}

// --- Offres d'un employeur (dashboard employeur) ---
async function getEmployerJobs(req, res, next) {
  try {
    const jobs = await Job.findAll({
      where: { employerId: req.user.id },
      include: [{ model: Application, as: 'applications', attributes: ['id', 'status'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ jobs });
  } catch (err) { next(err); }
}

module.exports = { createJob, updateJob, deleteJob, getJob, listJobs, getEmployerJobs };
