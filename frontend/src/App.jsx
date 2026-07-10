import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import RegisterCandidate from './pages/RegisterCandidate';
import RegisterEmployer from './pages/RegisterEmployer';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/candidate" element={<RegisterCandidate />} />
          <Route path="/register/employer" element={<RegisterEmployer />} />

          <Route path="/candidate/dashboard" element={
            <ProtectedRoute allow={['candidate']}><CandidateDashboard /></ProtectedRoute>
          } />

          <Route path="/employer/dashboard" element={
            <ProtectedRoute allow={['employer']}><EmployerDashboard /></ProtectedRoute>
          } />
          <Route path="/employer/jobs/new" element={
            <ProtectedRoute allow={['employer']}><PostJob /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<div className="mx-auto max-w-3xl px-6 py-24 text-center text-slate-500">Page introuvable.</div>} />
        </Routes>
      </main>
    
    </div>
  );
}
