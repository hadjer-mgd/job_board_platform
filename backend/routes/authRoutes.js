const router = require('express').Router();
const { registerCandidate, registerEmployer, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register/candidate', registerCandidate);
router.post('/register/employer', registerEmployer);
router.post('/login', login);
router.get('/me', authenticate, me);

module.exports = router;
