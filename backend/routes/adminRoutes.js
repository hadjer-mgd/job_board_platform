const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getStats, listEmployers, listCandidates, listAllJobs,
  deleteEmployer, deleteCandidate, deleteJobAdmin, registerAdmin,
} = require('../controllers/adminController');

router.post('/register', registerAdmin); // à protéger/désactiver en production
router.get('/stats', authenticate, requireRole('admin'), getStats);
router.get('/employers', authenticate, requireRole('admin'), listEmployers);
router.get('/candidates', authenticate, requireRole('admin'), listCandidates);
router.get('/jobs', authenticate, requireRole('admin'), listAllJobs);
router.delete('/employers/:id', authenticate, requireRole('admin'), deleteEmployer);
router.delete('/candidates/:id', authenticate, requireRole('admin'), deleteCandidate);
router.delete('/jobs/:id', authenticate, requireRole('admin'), deleteJobAdmin);

module.exports = router;
