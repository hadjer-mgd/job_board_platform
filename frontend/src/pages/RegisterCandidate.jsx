import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterCandidate() {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', headline: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerCandidate(form);
      navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-50 via-canvas to-primary-200 px-6 py-12">
      <div className="card w-full max-w-2xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900">Créer un compte candidat</h1>
        <p className="mt-1 text-sm text-slate-500">Postulez aux meilleures offres en quelques clics.</p>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Prénom</label>
              <input required className="input" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </div>
            <div>
              <label className="label">Nom</label>
              <input required className="input" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
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
              <label className="label">Titre professionnel</label>
              <input className="input" placeholder="ex: Développeur Full-Stack" value={form.headline} onChange={(e) => update('headline', e.target.value)} />
            </div>
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