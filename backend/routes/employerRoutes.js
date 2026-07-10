const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/employerController');

router.get('/profile', authenticate, requireRole('employer'), getProfile);
router.put('/profile', authenticate, requireRole('employer'), updateProfile);

module.exports = router;
