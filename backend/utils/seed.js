// Script optionnel pour peupler la base avec des données de démonstration.
// Lancer avec: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Employer, Candidate, Job, Admin } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const password = await bcrypt.hash('password123', 10);

  const employer = await Employer.create({
    companyName: 'TechAlgeria SPA',
    email: 'employer@demo.com',
    password,
    phone: '0555123456',
    website: 'https://techalgeria.dz',
    address: 'Alger, Algérie',
    industry: 'Informatique',
    description: 'Entreprise algérienne spécialisée dans le développement de logiciels.',
  });

  const candidate = await Candidate.create({
    firstName: 'Sara',
    lastName: 'Benali',
    email: 'candidate@demo.com',
    password,
    phone: '0555987654',
    headline: 'Développeuse Full-Stack Laravel/React',
    skills: JSON.stringify(['PHP', 'Laravel', 'React', 'MySQL']),
    experienceYears: 2,
  });

  await Admin.create({
    name: 'Super Admin',
    email: 'admin@demo.com',
    password,
  });

  await Job.bulkCreate([
    {
      employerId: employer.id,
      title: 'Développeur Web Full-Stack (Laravel/React)',
      description: "Nous recherchons un développeur full-stack pour renforcer notre équipe produit.",
      requirements: 'PHP, Laravel, React, MySQL, Git',
      location: 'Alger',
      jobType: 'full-time',
      category: 'Développement Web',
      experienceLevel: 'junior',
      salaryMin: 60000,
      salaryMax: 90000,
      status: 'open',
    },
    {
      employerId: employer.id,
      title: 'Stagiaire Développement Logiciel',
      description: 'Stage de fin d\'études en développement logiciel, encadrement assuré.',
      requirements: 'Étudiant en informatique, notions de C/Java',
      location: 'Alger (Hydra)',
      jobType: 'internship',
      category: 'Développement',
      experienceLevel: 'junior',
      salaryMin: 15000,
      salaryMax: 25000,
      status: 'open',
    },
  ]);

  console.log('✅ Données de démonstration créées :');
  console.log('   Employeur -> employer@demo.com / password123');
  console.log('   Candidat  -> candidate@demo.com / password123');
  console.log('   Admin     -> admin@demo.com / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
