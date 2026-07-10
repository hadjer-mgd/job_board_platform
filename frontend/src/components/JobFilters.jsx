export default function JobFilters({ filters, setFilters, onSearch }) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(); }}
      className="card grid grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-6"
    >
      <div className="lg:col-span-2">
        <label className="label">Mot-clé</label>
        <input className="input" placeholder="Titre, compétence..." value={filters.keyword || ''} onChange={(e) => update('keyword', e.target.value)} />
      </div>
      <div>
        <label className="label">Ville</label>
        <input className="input" placeholder="Alger, Oran..." value={filters.location || ''} onChange={(e) => update('location', e.target.value)} />
      </div>
      <div>
        <label className="label">Type</label>
        <select className="input" value={filters.jobType || ''} onChange={(e) => update('jobType', e.target.value)}>
          <option value="">Tous</option>
          <option value="full-time">Temps plein</option>
          <option value="part-time">Temps partiel</option>
          <option value="contract">Contrat</option>
          <option value="internship">Stage</option>
          <option value="remote">Télétravail</option>
        </select>
      </div>
      <div>
        <label className="label">Niveau</label>
        <select className="input" value={filters.experienceLevel || ''} onChange={(e) => update('experienceLevel', e.target.value)}>
          <option value="">Tous</option>
          <option value="junior">Junior</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full">Rechercher</button>
      </div>
    </form>
  );
}
