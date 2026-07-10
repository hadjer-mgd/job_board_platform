# JobDZ — Plateforme de Job Board

Plateforme complète de mise en relation employeurs / candidats : publication d'offres, recherche avec filtres, upload de CV, candidatures et suivi de statut, notifications, et panneau d'administration avec statistiques.

## Stack technique

- **Backend** : Node.js, Express.js, Sequelize (ORM), SQLite (base de données fichier, aucune installation de serveur DB requise), JWT (authentification), Multer (upload de fichiers), bcrypt.js.
- **Frontend** : React 18 (Vite), React Router, Tailwind CSS, Axios.

## Structure du projet

```
job-board-platform/
├── backend/     → API REST Express
└── frontend/    → Application React
```

## Démarrage rapide

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # déjà fait, à ajuster si besoin (JWT_SECRET notamment)
npm run seed            # optionnel : crée des comptes et offres de démonstration
npm run dev              # démarre le serveur sur http://localhost:5000
```

Comptes de démo créés par `npm run seed` (mot de passe : `password123`) :
- Employeur : `employer@demo.com`
- Candidat : `candidate@demo.com`
- Admin : `admin@demo.com`

Sans seed, vous pouvez créer un compte admin via `POST /api/admin/register` (voir README backend).

### 2. Frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev   # démarre l'app sur http://localhost:5173
```

Le frontend est préconfiguré (`vite.config.js`) pour rediriger les appels `/api` et `/uploads` vers `http://localhost:5000`, donc le backend doit tourner en parallèle.

## Fonctionnalités

**Candidats**
- Inscription / connexion
- Recherche d'offres avec filtres (mot-clé, ville, type de contrat, niveau d'expérience, salaire)
- Upload et gestion de plusieurs CV (choix d'un CV principal)
- Candidature à une offre avec lettre de motivation
- Suivi du statut de chaque candidature (en attente, examinée, présélectionnée, entretien, acceptée, refusée)
- Gestion du profil (compétences, expérience, bio)

**Employeurs**
- Inscription / connexion
- Publication, modification, clôture et suppression d'offres
- Consultation des candidatures reçues par offre ou globalement
- Mise à jour du statut des candidatures (déclenche une notification au candidat)
- Gestion du profil entreprise

**Administration**
- Statistiques globales (nombre d'employeurs, candidats, offres, candidatures par statut, offres par type, top employeurs)
- Gestion des utilisateurs (liste et suppression d'employeurs, candidats, offres)

**Notifications**
- Notification automatique à l'employeur lors d'une nouvelle candidature
- Notification automatique au candidat lors d'un changement de statut
- Endpoints pour lister / marquer comme lues

Voir `backend/README.md` pour le détail complet des routes de l'API.
