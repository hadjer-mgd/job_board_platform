import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const TABS = [
  { id: 'applications', label: 'Mes candidatures' },
  { id: 'resumes', label: 'Mes CV' },
  { id: 'profile', label: 'Mon profil' },
];

export default function CandidateDashboard() {
  const [tab, setTab] = useState('applications');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900">Tableau de bord candidat</h1>

<div className="mt-6 flex gap-2 border-b border-primary-100">        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-b-2 border-primary-600 text-primary-700' : 'text-slate-500'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'resumes' && <ResumesTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine').then(({ data }) => setApplications(data.applications)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (applications.length === 0) return <div className="card p-10 text-center text-slate-500">Vous n'avez postulé à aucune offre pour le moment. <Link to="/" className="text-primary-700 font-semibold">Parcourir les offres</Link></div>;

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to={`/jobs/${app.job.id}`} className="font-semibold text-slate-900 hover:text-primary-700">{app.job.title}</Link>
            <p className="text-sm text-slate-500">{app.job.employer?.companyName}</p>
            <p className="mt-1 text-xs text-slate-400">CV envoyé : {app.resume?.fileName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{new Date(app.createdAt).toLocaleDateString('fr-FR')}</span>
            <StatusBadge status={app.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ResumesTab() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const load = () => api.get('/resumes').then(({ data }) => setResumes(data.resumes)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await api.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du CV.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const setPrimary = async (id) => { await api.patch(`/resumes/${id}/primary`); load(); };
  const remove = async (id) => { if (confirm('Supprimer ce CV ?')) { await api.delete(`/resumes/${id}`); load(); } };

  if (loading) return <p className="text-slate-500">Chargement...</p>;

  return (
    <div>
      <div className="card p-5">
        <label className="label">Ajouter un CV (PDF, DOC, DOCX — 5 Mo max)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="text-sm" />
        {uploading && <p className="mt-2 text-sm text-primary-600">Envoi en cours...</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-5 space-y-3">
        {resumes.map((r) => (
          <div key={r.id} className="card flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${r.filePath}`} target="_blank" rel="noreferrer" className="font-medium text-slate-800 hover:text-primary-700">
                  {r.fileName}
                </a>
                {r.isPrimary && <span className="badge ml-2 bg-primary-50 text-primary-700">Principal</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {!r.isPrimary && <button onClick={() => setPrimary(r.id)} className="btn-outline text-xs">Définir principal</button>}
              <button onClick={() => remove(r.id)} className="btn-danger text-xs">Supprimer</button>
            </div>
          </div>
        ))}
        {resumes.length === 0 && <p className="text-sm text-slate-500">Aucun CV ajouté pour le moment.</p>}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/candidates/profile').then(({ data }) => {
      const skills = data.candidate.skills ? JSON.parse(data.candidate.skills) : [];
      setForm({ ...data.candidate, skillsText: skills.join(', ') });
    });
  }, []);

  if (!form) return <p className="text-slate-500">Chargement...</p>;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const skills = form.skillsText.split(',').map((s) => s.trim()).filter(Boolean);
      await api.put('/candidates/profile', {
        firstName: form.firstName, lastName: form.lastName, phone: form.phone,
        address: form.address, headline: form.headline, experienceYears: form.experienceYears,
        bio: form.bio, skills,
      });
      setMsg({ type: 'success', text: 'Profil mis à jour.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
      {msg && <div className={`rounded-xl p-3 text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Prénom</label><input className="input" value={form.firstName || ''} onChange={(e) => update('firstName', e.target.value)} /></div>
        <div><label className="label">Nom</label><input className="input" value={form.lastName || ''} onChange={(e) => update('lastName', e.target.value)} /></div>
      </div>
      <div><label className="label">Titre professionnel</label><input className="input" value={form.headline || ''} onChange={(e) => update('headline', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Téléphone</label><input className="input" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div>
        <div><label className="label">Années d'expérience</label><input type="number" min="0" className="input" value={form.experienceYears || 0} onChange={(e) => update('experienceYears', e.target.value)} /></div>
      </div>
      <div><label className="label">Adresse</label><input className="input" value={form.address || ''} onChange={(e) => update('address', e.target.value)} /></div>
      <div><label className="label">Compétences (séparées par des virgules)</label><input className="input" value={form.skillsText || ''} onChange={(e) => update('skillsText', e.target.value)} placeholder="PHP, Laravel, React" /></div>
      <div><label className="label">Bio</label><textarea rows={4} className="input" value={form.bio || ''} onChange={(e) => update('bio', e.target.value)} /></div>
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
    </form>
  );
}
