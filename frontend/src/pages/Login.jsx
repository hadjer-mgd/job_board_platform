import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(form.email, form.password, role);
      if (data.role === 'employer') navigate('/employer/dashboard');
      else if (data.role === 'candidate') navigate('/candidate/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-50 via-canvas to-primary-200 px-6 py-12">
      <div className="card w-full max-w-md bg-white p-8 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900">Connexion</h1>
        <p className="mt-1 text-sm text-slate-500">Accédez à votre espace JobDZ.</p>

        <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
          {[['candidate', 'Candidat'], ['employer', 'Employeur'], ['admin', 'Admin']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setRole(val)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${role === val ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to="/register/candidate" className="font-semibold text-primary-700">Candidat</Link>
          {' · '}
          <Link to="/register/employer" className="font-semibold text-primary-700">Employeur</Link>
        </p>
      </div>
    </div>
  );
}