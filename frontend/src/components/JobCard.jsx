import { Link } from 'react-router-dom';

const TYPE_LABELS = {
  'full-time': 'Temps plein',
  'part-time': 'Temps partiel',
  contract: 'Contrat',
  internship: 'Stage',
  remote: 'Télétravail',
};

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="card group block p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700">{job.title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{job.employer?.companyName}</p>
        </div>
        <span className="badge shrink-0 bg-primary-50 text-primary-700">{TYPE_LABELS[job.jobType] || job.jobType}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {job.location && <span className="rounded-full bg-slate-100 px-2.5 py-1">📍 {job.location}</span>}
        {job.experienceLevel && <span className="rounded-full bg-slate-100 px-2.5 py-1">🎯 {job.experienceLevel}</span>}
        {(job.salaryMin || job.salaryMax) && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1">
            💰 {job.salaryMin?.toLocaleString()} – {job.salaryMax?.toLocaleString()} DZD
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.description}</p>
    </Link>
  );
}
