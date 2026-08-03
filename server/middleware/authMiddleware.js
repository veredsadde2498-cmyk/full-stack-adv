const jwt = require('jsonwebtoken');
const User = require('../models/User');

// מוודא שהבקשה מגיעה עם JWT תקין ב-Authorization header, וטוען את המשתמש
// המחובר ל-req.user כדי שה-controllers הבאים יוכלו להשתמש בו
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('נדרשת התחברות - לא נמצא טוקן');
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // בלי password - השדה ממילא select:false כברירת מחדל בסכמה
        const user = await User.findById(decoded.userId);
        if (!user) {
            const error = new Error('המשתמש ששייך לטוקן לא קיים יותר');
            error.statusCode = 401;
            return next(error);
        }

        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = 'טוקן לא תקין או שפג תוקפו';
        next(error);
    }
};

// מגביל גישה לפי role - שימוש: router.get('/x', protect, restrictTo('admin'), handler)
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error('אין לך הרשאה לבצע פעולה זו');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};

module.exports = {
    protect,
    restrictTo
};
