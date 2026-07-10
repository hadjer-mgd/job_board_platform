const fs = require('fs');
const path = require('path');
const { Resume } = require('../models');

// --- Upload d'un CV (candidat) ---
async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu.' });

    const candidateId = req.user.id;
    const existingCount = await Resume.count({ where: { candidateId } });

    const resume = await Resume.create({
      candidateId,
      fileName: req.file.originalname,
      filePath: `/uploads/resumes/${req.file.filename}`,
      fileType: path.extname(req.file.originalname).slice(1),
      isPrimary: existingCount === 0, // le premier CV uploadé devient CV principal
    });

    res.status(201).json({ resume });
  } catch (err) { next(err); }
}

// --- Liste des CV du candidat connecté ---
async function listMyResumes(req, res, next) {
  try {
    const resumes = await Resume.findAll({
      where: { candidateId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ resumes });
  } catch (err) { next(err); }
}

// --- Définir un CV comme principal ---
async function setPrimary(req, res, next) {
  try {
    const resume = await Resume.findByPk(req.params.id);
    if (!resume || resume.candidateId !== req.user.id) {
      return res.status(404).json({ message: 'CV introuvable.' });
    }
    await Resume.update({ isPrimary: false }, { where: { candidateId: req.user.id } });
    resume.isPrimary = true;
    await resume.save();
    res.json({ resume });
  } catch (err) { next(err); }
}

// --- Supprimer un CV ---
async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findByPk(req.params.id);
    if (!resume || resume.candidateId !== req.user.id) {
      return res.status(404).json({ message: 'CV introuvable.' });
    }
    const filePath = path.join(__dirname, '..', resume.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await resume.destroy();
    res.json({ message: 'CV supprimé.' });
  } catch (err) { next(err); }
}

module.exports = { uploadResume, listMyResumes, setPrimary, deleteResume };
