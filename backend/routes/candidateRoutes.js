const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/candidateController');

router.get('/profile', authenticate, requireRole('candidate'), getProfile);
router.put('/profile', authenticate, requireRole('candidate'), updateProfile);

module.exports = router;
