# Backend — Job Board API

API REST construite avec Express.js et Sequelize (SQLite).

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Le serveur démarre sur `http://localhost:5000`. La base SQLite (`database.sqlite`) est créée et synchronisée automatiquement au démarrage.

## Données de démonstration

```bash
npm run seed
```

⚠️ Le seed **réinitialise entièrement la base** (`sequelize.sync({ force: true })`).

## Créer un compte administrateur manuellement

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@demo.com","password":"password123"}'
```

> En production, il est recommandé de protéger ou désactiver cette route après la création du premier admin.

## Authentification

Toutes les routes protégées attendent un header :
```
Authorization: Bearer <token>
```
Le token est renvoyé par `/api/auth/login` ou par les routes d'inscription.

## Principales routes

### Auth (`/api/auth`)
| Méthode | Route | Description |
|---|---|---|
| POST | `/register/candidate` | Inscription candidat |
| POST | `/register/employer` | Inscription employeur |
| POST | `/login` | Connexion (`{ email, password, role }`, role ∈ candidate/employer/admin) |
| GET | `/me` | Profil de l'utilisateur connecté |

### Offres (`/api/jobs`)
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | public | Recherche avec filtres : `keyword, location, jobType, category, experienceLevel, salaryMin, salaryMax, page, limit` |
| GET | `/:id` | public | Détail d'une offre |
| GET | `/mine` | employeur | Offres de l'employeur connecté |
| POST | `/` | employeur | Créer une offre |
| PUT | `/:id` | employeur (propriétaire) | Modifier une offre |
| DELETE | `/:id` | employeur (propriétaire) | Supprimer une offre |

### CV (`/api/resumes`)
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | candidat | Liste de mes CV |
| POST | `/` | candidat | Upload d'un CV (`multipart/form-data`, champ `resume`) |
| PATCH | `/:id/primary` | candidat | Définir un CV comme principal |
| DELETE | `/:id` | candidat | Supprimer un CV |

### Candidatures (`/api/applications`)
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | candidat | Postuler (`{ jobId, resumeId, coverLetter }`) |
| GET | `/mine` | candidat | Mes candidatures |
| GET | `/employer/all` | employeur | Toutes les candidatures reçues |
| GET | `/job/:jobId` | employeur (propriétaire) | Candidatures pour une offre donnée |
| PATCH | `/:id/status` | employeur (propriétaire) | Modifier le statut (`{ status }`) |

### Profils
- `GET/PUT /api/candidates/profile` (candidat)
- `GET/PUT /api/employers/profile` (employeur)

### Notifications (`/api/notifications`)
- `GET /` — mes notifications
- `PATCH /:id/read` — marquer comme lue
- `PATCH /read-all` — tout marquer comme lu

### Admin (`/api/admin`)
- `GET /stats` — statistiques globales
- `GET /employers`, `GET /candidates`, `GET /jobs` — listes
- `DELETE /employers/:id`, `DELETE /candidates/:id`, `DELETE /jobs/:id`

## Fichiers uploadés

Les CV sont stockés dans `uploads/resumes/` et servis statiquement via `/uploads/resumes/<fichier>`.
