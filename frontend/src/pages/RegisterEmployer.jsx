import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterEmployer() {
  const { registerEmployer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ companyName: '', email: '', password: '', phone: '', website: '', industry: '', address: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerEmployer(form);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-50 via-canvas to-primary-200 px-6 py-12">
      <div className="card w-full max-w-2xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900">Créer un compte employeur</h1>
        <p className="mt-1 text-sm text-slate-500">Publiez vos offres et trouvez les meilleurs talents.</p>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nom de l'entreprise</label>
              <input required className="input" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
            </div>
            <div>
              <label className="label">Secteur d'activité</label>
              <input className="input" placeholder="ex: Informatique" value={form.industry} onChange={(e) => update('industry', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Téléphone</label>
              <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Site web</label>
              <input className="input" value={form.website} onChange={(e) => update('website', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Adresse</label>
            <input className="input" value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà inscrit ? <Link to="/login" className="font-semibold text-primary-700">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}