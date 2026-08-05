const express = require('express');
const router = express.Router();
const { register, login, googleLogin, getMe, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const handleAvatarUpload = require('../middleware/upload');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleLogin); // בלי authLimiter - האימות האמיתי נעשה מול גוגל, לא ניסוי-וטעייה של סיסמה
router.get('/me', protect, getMe);
router.put('/avatar', protect, handleAvatarUpload, uploadAvatar);

module.exports = router;
