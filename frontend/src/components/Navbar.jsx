import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardLink =
    role === 'employer' ? '/employer/dashboard' :
    role === 'candidate' ? '/candidate/dashboard' :
    role === 'admin' ? '/admin/dashboard' : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
<header className="sticky top-0 z-40 border-b border-primary-100 bg-white/80 backdrop-blur">      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">J</span>
          JobDZ
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="hover:text-primary-700">Offres d'emploi</Link>
          {!role && <Link to="/register/employer" className="hover:text-primary-700">Recruter</Link>}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline">Connexion</Link>
              <Link to="/register/candidate" className="btn-primary">S'inscrire</Link>
            </>
          ) : (
            <>
              <NotificationBell />
              <Link to={dashboardLink} className="text-sm font-semibold text-slate-700 hover:text-primary-700">
                {role === 'employer' ? user.companyName : role === 'candidate' ? `${user.firstName} ${user.lastName}` : user.name}
              </Link>
              <button onClick={handleLogout} className="btn-outline">Déconnexion</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}