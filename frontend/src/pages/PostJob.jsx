import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', location: '',
    jobType: 'full-time', category: '', experienceLevel: 'junior',
    salaryMin: '', salaryMax: '', deadline: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { ...form, salaryMin: form.salaryMin ? Number(form.salaryMin) : null, salaryMax: form.salaryMax ? Number(form.salaryMax) : null };
      const { data } = await api.post('/jobs', payload);
      navigate(`/jobs/${data.job.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication.");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900">Publier une nouvelle offre</h1>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div><label className="label">Titre du poste</label><input required className="input" value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
        <div><label className="label">Description</label><textarea required rows={5} className="input" value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
        <div><label className="label">Exigences / compétences</label><textarea rows={3} className="input" value={form.requirements} onChange={(e) => update('requirements', e.target.value)} /></div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Lieu</label><input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Alger" /></div>
          <div><label className="label">Catégorie</label><input className="input" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="Développement Web" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Type de contrat</label>
            <select className="input" value={form.jobType} onChange={(e) => update('jobType', e.target.value)}>
              <option value="full-time">Temps plein</option>
              <option value="part-time">Temps partiel</option>
              <option value="contract">Contrat</option>
              <option value="internship">Stage</option>
              <option value="remote">Télétravail</option>
            </select>
          </div>
          <div>
            <label className="label">Niveau d'expérience</label>
            <select className="input" value={form.experienceLevel} onChange={(e) => update('experienceLevel', e.target.value)}>
              <option value="junior">Junior</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Salaire min (DZD)</label><input type="number" className="input" value={form.salaryMin} onChange={(e) => update('salaryMin', e.target.value)} /></div>
          <div><label className="label">Salaire max (DZD)</label><input type="number" className="input" value={form.salaryMax} onChange={(e) => update('salaryMax', e.target.value)} /></div>
        </div>

        <div><label className="label">Date limite de candidature</label><input type="date" className="input" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} /></div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Publication...' : "Publier l'offre"}</button>
      </form>
    </div>
  );
}
