const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadResume, listMyResumes, setPrimary, deleteResume } = require('../controllers/resumeController');

router.get('/', authenticate, requireRole('candidate'), listMyResumes);
router.post('/', authenticate, requireRole('candidate'), upload.single('resume'), uploadResume);
router.patch('/:id/primary', authenticate, requireRole('candidate'), setPrimary);
router.delete('/:id', authenticate, requireRole('candidate'), deleteResume);

module.exports = router;
