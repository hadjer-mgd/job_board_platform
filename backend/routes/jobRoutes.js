const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createJob, updateJob, deleteJob, getJob, listJobs, getEmployerJobs,
} = require('../controllers/jobController');

router.get('/', listJobs); // recherche publique avec filtres via query params
router.get('/mine', authenticate, requireRole('employer'), getEmployerJobs);
router.get('/:id', getJob);
router.post('/', authenticate, requireRole('employer'), createJob);
router.put('/:id', authenticate, requireRole('employer'), updateJob);
router.delete('/:id', authenticate, requireRole('employer'), deleteJob);

module.exports = router;
