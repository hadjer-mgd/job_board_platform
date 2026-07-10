 Job Board Platform : to handle job listings, employers, candidates and applications. 
● Design database models for employers, job listings, candidates, resumes, and job applications ,for posting jobs, searching jobs, uploading resumes, applying for jobs, and tracking applications. 

# Frontend — JobDZ

Application React (Vite + Tailwind CSS) consommant l'API du backend.

## Installation

```bash
npm install
cp .env.example .env   # déjà fait ; ajustez VITE_API_URL si le backend tourne ailleurs
npm run dev
```

L'application démarre sur `http://localhost:5173`. Le backend doit tourner sur `http://localhost:5000` (ou ajustez `VITE_API_URL` et `vite.config.js`).

## Pages principales

- `/` — recherche et liste des offres
- `/jobs/:id` — détail d'une offre + candidature
- `/login`, `/register/candidate`, `/register/employer`
- `/candidate/dashboard` — candidatures, CV, profil
- `/employer/dashboard` — offres publiées, candidatures reçues, profil entreprise
- `/employer/jobs/new` — publier une offre
- `/admin/dashboard` — statistiques et gestion des utilisateurs

## Build de production

```bash
npm run build
npm run preview
```
