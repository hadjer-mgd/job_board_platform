const STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  reviewed: 'bg-blue-50 text-blue-700',
  shortlisted: 'bg-purple-50 text-purple-700',
  interview: 'bg-indigo-50 text-indigo-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  open: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-slate-100 text-slate-600',
};

const LABELS = {
  pending: 'En attente',
  reviewed: 'Examinée',
  shortlisted: 'Présélectionnée',
  interview: 'Entretien',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  open: 'Ouverte',
  closed: 'Fermée',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {LABELS[status] || status}
    </span>
  );
}
