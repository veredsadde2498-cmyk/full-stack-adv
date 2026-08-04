const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleLogin); // בלי authLimiter - האימות האמיתי נעשה מול גוגל, לא ניסוי-וטעייה של סיסמה
router.get('/me', protect, getMe);

module.exports = router;
