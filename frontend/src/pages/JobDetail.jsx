import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const TYPE_LABELS = {
  'full-time': 'Temps plein', 'part-time': 'Temps partiel',
  contract: 'Contrat', internship: 'Stage', remote: 'Télétravail',
};

export default function JobDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyMsg, setApplyMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data.job)).finally(() => setLoading(false));
  }, [id]);

  const openApplyModal = async () => {
    if (role !== 'candidate') { navigate('/login'); return; }
    setApplyMsg(null);
    try {
      const { data } = await api.get('/resumes');
      setResumes(data.resumes);
      if (data.resumes.length) setResumeId(String(data.resumes.find((r) => r.isPrimary)?.id || data.resumes[0].id));
      setShowApply(true);
    } catch (err) {
      setApplyMsg({ type: 'error', text: "Impossible de charger vos CV." });
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!resumeId) { setApplyMsg({ type: 'error', text: 'Veuillez sélectionner un CV.' }); return; }
    setSubmitting(true);
    setApplyMsg(null);
    try {
      await api.post('/applications', { jobId: job.id, resumeId: Number(resumeId), coverLetter });
      setApplyMsg({ type: 'success', text: 'Candidature envoyée avec succès !' });
      setTimeout(() => setShowApply(false), 1500);
    } catch (err) {
      setApplyMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la candidature.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-6 py-16 text-slate-500">Chargement...</div>;
  if (!job) return <div className="mx-auto max-w-4xl px-6 py-16 text-slate-500">Offre introuvable.</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="card p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{job.title}</h1>
            <p className="mt-1 text-slate-500">{job.employer?.companyName} · {job.location}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">{TYPE_LABELS[job.jobType] || job.jobType}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5">Niveau : {job.experienceLevel}</span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5">
              {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()} DZD
            </span>
          )}
          {job.category && <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.category}</span>}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">Description du poste</h2>
          <p className="mt-2 whitespace-pre-line text-slate-700">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">Exigences</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">{job.requirements}</p>
          </div>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6">
          {job.status === 'open' ? (
            <button onClick={openApplyModal} className="btn-primary">Postuler à cette offre</button>
          ) : (
            <p className="text-sm text-slate-500">Cette offre n'accepte plus de candidatures.</p>
          )}
        </div>
      </div>

      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowApply(false)}>
          <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900">Postuler — {job.title}</h3>

            {applyMsg && (
              <div className={`mt-4 rounded-xl p-3 text-sm ${applyMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {applyMsg.text}
              </div>
            )}

            {resumes.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Vous n'avez pas encore de CV. Ajoutez-en un depuis votre tableau de bord avant de postuler.
              </p>
            ) : (
              <form onSubmit={submitApplication} className="mt-4 space-y-4">
                <div>
                  <label className="label">CV à envoyer</label>
                  <select className="input" value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>{r.fileName}{r.isPrimary ? ' (principal)' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Lettre de motivation (optionnel)</label>
                  <textarea className="input" rows={4} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Expliquez pourquoi vous êtes le candidat idéal..." />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" className="btn-outline" onClick={() => setShowApply(false)}>Annuler</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Envoi...' : 'Envoyer ma candidature'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
