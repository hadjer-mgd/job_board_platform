const { Application, Job, Candidate, Resume, Employer } = require('../models');
const { notify } = require('../utils/notifications');

// --- Postuler à une offre (candidat) ---
async function applyToJob(req, res, next) {
  try {
    const candidateId = req.user.id;
    const { jobId, resumeId, coverLetter } = req.body;

    if (!jobId || !resumeId) {
      return res.status(400).json({ message: 'jobId et resumeId sont requis.' });
    }

    const job = await Job.findByPk(jobId);
    if (!job || job.status !== 'open') {
      return res.status(404).json({ message: 'Offre introuvable ou fermée.' });
    }

    const resume = await Resume.findByPk(resumeId);
    if (!resume || resume.candidateId !== candidateId) {
      return res.status(400).json({ message: 'CV invalide.' });
    }

    const already = await Application.findOne({ where: { jobId, candidateId } });
    if (already) return res.status(409).json({ message: 'Vous avez déjà postulé à cette offre.' });

    const application = await Application.create({ jobId, candidateId, resumeId, coverLetter });

    // Notification employeur
    const candidate = await Candidate.findByPk(candidateId);
    await notify({
      recipientType: 'employer',
      recipientId: job.employerId,
      type: 'new_application',
      message: `${candidate.firstName} ${candidate.lastName} a postulé à l'offre "${job.title}".`,
    });

    res.status(201).json({ application });
  } catch (err) { next(err); }
}

// --- Mes candidatures (candidat) ---
async function listMyApplications(req, res, next) {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [
        { model: Job, as: 'job', include: [{ model: Employer, as: 'employer', attributes: ['companyName', 'logoUrl'] }] },
        { model: Resume, as: 'resume', attributes: ['id', 'fileName', 'filePath'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ applications });
  } catch (err) { next(err); }
}

// --- Candidatures reçues pour une offre (employeur) ---
async function listJobApplications(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Offre introuvable.' });
    if (job.employerId !== req.user.id) return res.status(403).json({ message: 'Action non autorisée.' });

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        { model: Candidate, as: 'candidate', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'headline', 'skills', 'experienceYears'] },
        { model: Resume, as: 'resume', attributes: ['id', 'fileName', 'filePath'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ applications });
  } catch (err) { next(err); }
}

// --- Toutes les candidatures reçues par l'employeur (tous jobs confondus) ---
async function listAllEmployerApplications(req, res, next) {
  try {
    const applications = await Application.findAll({
      include: [
        { model: Job, as: 'job', where: { employerId: req.user.id }, attributes: ['id', 'title'] },
        { model: Candidate, as: 'candidate', attributes: ['id', 'firstName', 'lastName', 'email', 'headline'] },
        { model: Resume, as: 'resume', attributes: ['id', 'fileName', 'filePath'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ applications });
  } catch (err) { next(err); }
}

// --- Mise à jour du statut d'une candidature (employeur) ---
async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job' }],
    });
    if (!application) return res.status(404).json({ message: 'Candidature introuvable.' });
    if (application.job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée.' });
    }

    application.status = status;
    application.statusUpdatedAt = new Date();
    await application.save();

    // Notification candidat
    await notify({
      recipientType: 'candidate',
      recipientId: application.candidateId,
      type: 'status_update',
      message: `Le statut de votre candidature pour "${application.job.title}" est désormais : ${status}.`,
    });

    res.json({ application });
  } catch (err) { next(err); }
}

module.exports = {
  applyToJob,
  listMyApplications,
  listJobApplications,
  listAllEmployerApplications,
  updateApplicationStatus,
};
