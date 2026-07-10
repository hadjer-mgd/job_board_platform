const sequelize = require('../config/db');
const Employer = require('./Employer');
const Candidate = require('./Candidate');
const Job = require('./Job');
const Resume = require('./Resume');
const Application = require('./Application');
const Notification = require('./Notification');
const Admin = require('./Admin');

// --- Associations ---

// Employer <-> Job
Employer.hasMany(Job, { foreignKey: 'employerId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });

// Candidate <-> Resume
Candidate.hasMany(Resume, { foreignKey: 'candidateId', as: 'resumes', onDelete: 'CASCADE' });
Resume.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

// Candidate <-> Application
Candidate.hasMany(Application, { foreignKey: 'candidateId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Candidate, { foreignKey: 'candidateId', as: 'candidate' });

// Job <-> Application
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Resume <-> Application
Resume.hasMany(Application, { foreignKey: 'resumeId', as: 'applications' });
Application.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

module.exports = {
  sequelize,
  Employer,
  Candidate,
  Job,
  Resume,
  Application,
  Notification,
  Admin,
};
