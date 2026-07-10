import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const TABS = [
  { id: 'jobs', label: 'Mes offres' },
  { id: 'applications', label: 'Candidatures reçues' },
  { id: 'profile', label: "Profil de l'entreprise" },
];

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'];

export default function EmployerDashboard() {
  const [tab, setTab] = useState('jobs');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">Tableau de bord employeur</h1>
        <Link to="/employer/jobs/new" className="btn-primary">+ Publier une offre</Link>
      </div>

<div className="mt-6 flex gap-2 border-b border-primary-100">        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-b-2 border-primary-600 text-primary-700' : 'text-slate-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'jobs' && <JobsTab />}
        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}

function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/jobs/mine').then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggleStatus = async (job) => {
    await api.put(`/jobs/${job.id}`, { status: job.status === 'open' ? 'closed' : 'open' });
    load();
  };

  const remove = async (id) => {
    if (confirm('Supprimer cette offre et toutes ses candidatures ?')) {
      await api.delete(`/jobs/${id}`);
      load();
    }
  };

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (jobs.length === 0) return <div className="card p-10 text-center text-slate-500">Aucune offre publiée. <Link to="/employer/jobs/new" className="font-semibold text-primary-700">Publier votre première offre</Link></div>;

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-900 hover:text-primary-700">{job.title}</Link>
            <p className="text-sm text-slate-500">{job.location} · {job.applications?.length || 0} candidature(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={job.status} />
            <button onClick={() => toggleStatus(job)} className="btn-outline text-xs">{job.status === 'open' ? 'Clôturer' : 'Réouvrir'}</button>
            <button onClick={() => remove(job.id)} className="btn-danger text-xs">Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/applications/employer/all').then(({ data }) => setApplications(data.applications)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/applications/${id}/status`, { status });
    load();
  };

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (applications.length === 0) return <div className="card p-10 text-center text-slate-500">Aucune candidature reçue pour le moment.</div>;

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div key={app.id} className="card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">{app.candidate.firstName} {app.candidate.lastName}</p>
              <p className="text-sm text-slate-500">{app.candidate.headline}</p>
              <p className="mt-1 text-xs text-slate-400">Pour : {app.job.title}</p>
              <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${app.resume.filePath}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-primary-700">
                📄 Voir le CV
              </a>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={app.status} />
              <select className="input w-auto text-xs" value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/employers/profile').then(({ data }) => setForm(data.employer)); }, []);
  if (!form) return <p className="text-slate-500">Chargement...</p>;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/employers/profile', form);
      setMsg({ type: 'success', text: 'Profil mis à jour.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
      {msg && <div className={`rounded-xl p-3 text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg.text}</div>}
      <div><label className="label">Nom de l'entreprise</label><input className="input" value={form.companyName || ''} onChange={(e) => update('companyName', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Téléphone</label><input className="input" value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} /></div>
        <div><label className="label">Secteur</label><input className="input" value={form.industry || ''} onChange={(e) => update('industry', e.target.value)} /></div>
      </div>
      <div><label className="label">Site web</label><input className="input" value={form.website || ''} onChange={(e) => update('website', e.target.value)} /></div>
      <div><label className="label">Adresse</label><input className="input" value={form.address || ''} onChange={(e) => update('address', e.target.value)} /></div>
      <div><label className="label">Description</label><textarea rows={4} className="input" value={form.description || ''} onChange={(e) => update('description', e.target.value)} /></div>
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
    </form>
  );
}
