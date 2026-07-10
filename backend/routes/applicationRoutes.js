const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
  applyToJob, listMyApplications, listJobApplications,
  listAllEmployerApplications, updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/', authenticate, requireRole('candidate'), applyToJob);
router.get('/mine', authenticate, requireRole('candidate'), listMyApplications);
router.get('/employer/all', authenticate, requireRole('employer'), listAllEmployerApplications);
router.get('/job/:jobId', authenticate, requireRole('employer'), listJobApplications);
router.patch('/:id/status', authenticate, requireRole('employer'), updateApplicationStatus);

module.exports = router;
