import { useEffect, useState } from 'react';
import api from '../api/axios';

const TABS = [
  { id: 'stats', label: 'Statistiques' },
  { id: 'employers', label: 'Employeurs' },
  { id: 'candidates', label: 'Candidats' },
  { id: 'jobs', label: 'Offres' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats');

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900">Tableau de bord administrateur</h1>

<div className="mt-6 flex gap-2 border-b border-primary-100">        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-b-2 border-primary-600 text-primary-700' : 'text-slate-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'stats' && <StatsTab />}
        {tab === 'employers' && <EmployersTab />}
        {tab === 'candidates' && <CandidatesTab />}
        {tab === 'jobs' && <JobsTab />}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${accent || 'text-slate-900'}`}>{value}</p>
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/admin/stats').then(({ data }) => setStats(data)); }, []);
  if (!stats) return <p className="text-slate-500">Chargement...</p>;

  const { totals, applicationsByStatus, jobsByType, topEmployers } = stats;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Employeurs" value={totals.totalEmployers} />
        <StatCard label="Candidats" value={totals.totalCandidates} />
        <StatCard label="Offres totales" value={totals.totalJobs} />
        <StatCard label="Offres ouvertes" value={totals.openJobs} accent="text-emerald-600" />
        <StatCard label="Candidatures" value={totals.totalApplications} accent="text-primary-600" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold text-slate-900">Candidatures par statut</h3>
          <div className="mt-4 space-y-2">
            {applicationsByStatus.map((row) => (
              <div key={row.status} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{row.status}</span>
                <span className="font-semibold text-slate-900">{row.dataValues?.count ?? row.get?.('count')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-slate-900">Offres par type de contrat</h3>
          <div className="mt-4 space-y-2">
            {jobsByType.map((row) => (
              <div key={row.jobType} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{row.jobType}</span>
                <span className="font-semibold text-slate-900">{row.dataValues?.count ?? row.get?.('count')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-slate-900">Top employeurs (nombre d'offres)</h3>
        <div className="mt-4 space-y-2">
          {topEmployers.map((row, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{row.employer?.companyName}</span>
              <span className="font-semibold text-slate-900">{row.dataValues?.jobCount ?? row.get?.('jobCount')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployersTab() {
  const [employers, setEmployers] = useState([]);
  const load = () => api.get('/admin/employers').then(({ data }) => setEmployers(data.employers));
  useEffect(() => { load(); }, []);

  const remove = async (id) => { if (confirm('Supprimer cet employeur et ses offres ?')) { await api.delete(`/admin/employers/${id}`); load(); } };

  return (
    <div className="card overflow-x-auto p-5">
      <table className="w-full text-left text-sm">
        <thead><tr className="text-slate-500"><th className="pb-2">Entreprise</th><th className="pb-2">Email</th><th className="pb-2">Secteur</th><th></th></tr></thead>
        <tbody>
          {employers.map((e) => (
            <tr key={e.id} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{e.companyName}</td>
              <td className="py-2 text-slate-600">{e.email}</td>
              <td className="py-2 text-slate-600">{e.industry}</td>
              <td className="py-2 text-right"><button onClick={() => remove(e.id)} className="btn-danger text-xs">Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CandidatesTab() {
  const [candidates, setCandidates] = useState([]);
  const load = () => api.get('/admin/candidates').then(({ data }) => setCandidates(data.candidates));
  useEffect(() => { load(); }, []);

  const remove = async (id) => { if (confirm('Supprimer ce candidat ?')) { await api.delete(`/admin/candidates/${id}`); load(); } };

  return (
    <div className="card overflow-x-auto p-5">
      <table className="w-full text-left text-sm">
        <thead><tr className="text-slate-500"><th className="pb-2">Nom</th><th className="pb-2">Email</th><th className="pb-2">Titre</th><th></th></tr></thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{c.firstName} {c.lastName}</td>
              <td className="py-2 text-slate-600">{c.email}</td>
              <td className="py-2 text-slate-600">{c.headline}</td>
              <td className="py-2 text-right"><button onClick={() => remove(c.id)} className="btn-danger text-xs">Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JobsTab() {
  const [jobs, setJobs] = useState([]);
  const load = () => api.get('/admin/jobs').then(({ data }) => setJobs(data.jobs));
  useEffect(() => { load(); }, []);

  const remove = async (id) => { if (confirm('Supprimer cette offre ?')) { await api.delete(`/admin/jobs/${id}`); load(); } };

  return (
    <div className="card overflow-x-auto p-5">
      <table className="w-full text-left text-sm">
        <thead><tr className="text-slate-500"><th className="pb-2">Titre</th><th className="pb-2">Entreprise</th><th className="pb-2">Statut</th><th></th></tr></thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-t border-slate-100">
              <td className="py-2 font-medium text-slate-800">{j.title}</td>
              <td className="py-2 text-slate-600">{j.employer?.companyName}</td>
              <td className="py-2 text-slate-600">{j.status}</td>
              <td className="py-2 text-right"><button onClick={() => remove(j.id)} className="btn-danger text-xs">Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
