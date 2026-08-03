const rateLimit = require('express-rate-limit');

// מגבלה כללית על כל ה-API - הגנה בסיסית מפני עומס יתר
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'יותר מדי בקשות מכתובת IP זו, נסי שוב בעוד כמה דקות'
    }
});

// מגבלה מחמירה יותר על login/register - הגנה מפני brute-force על סיסמאות
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'יותר מדי ניסיונות התחברות/הרשמה, נסי שוב בעוד כמה דקות'
    }
});

module.exports = {
    apiLimiter,
    authLimiter
};
