import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchJobs = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page: targetPage, limit: 9 };
      Object.keys(params).forEach((k) => (params[k] === '' || params[k] === undefined) && delete params[k]);
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => { fetchJobs(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">Trouvez le job qui vous correspond</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Des centaines d'offres publiées par des entreprises algériennes, mises à jour chaque jour.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-8 max-w-7xl px-6">
        <JobFilters filters={filters} setFilters={setFilters} onSearch={() => fetchJobs(1)} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">{total} offre(s) trouvée(s)</p>
        </div>

        {loading ? (
          <p className="text-slate-500">Chargement des offres...</p>
        ) : jobs.length === 0 ? (
          <div className="card p-10 text-center text-slate-500">Aucune offre ne correspond à votre recherche.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="btn-outline" disabled={page <= 1} onClick={() => fetchJobs(page - 1)}>Précédent</button>
            <span className="text-sm text-slate-600">Page {page} / {totalPages}</span>
            <button className="btn-outline" disabled={page >= totalPages} onClick={() => fetchJobs(page + 1)}>Suivant</button>
          </div>
        )}
      </div>
    </div>
  );
}
