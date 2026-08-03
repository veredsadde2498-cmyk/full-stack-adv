const jwt = require('jsonwebtoken');
const User = require('../models/User');

// יוצר JWT חתום עם userId ו-role, לפי הסוד ותוקף שמוגדרים ב-.env
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// הרשמת משתמש חדש
const register = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email?.toLowerCase().trim();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('משתמש עם אימייל זה כבר קיים');
            error.statusCode = 409;
            return next(error);
        }

        // הסיסמה מוצפנת אוטומטית ב-pre-save hook שבמודל, לא כאן
        const user = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        error.statusCode = error.statusCode || 400; // כנראה שגיאת ולידציה של Mongoose
        next(error);
    }
};

// התחברות - מחזיר JWT אם פרטי ההתחברות תקינים
const login = async (req, res, next) => {
    try {
        const email = req.body.email?.toLowerCase().trim();
        const { password } = req.body;

        // הודעה גנרית זהה בין "אימייל לא נמצא" ל"סיסמה שגויה" - כדי לא לחשוף
        // למתקיף אם אימייל מסוים רשום במערכת בכלל (user enumeration)
        if (!email || !password) {
            const error = new Error('פרטי התחברות שגויים');
            error.statusCode = 401;
            return next(error);
        }

        // +password כי בסכמה יש select:false כברירת מחדל על השדה
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            const error = new Error('פרטי התחברות שגויים');
            error.statusCode = 401;
            return next(error);
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// מחזיר את פרטי המשתמש המחובר - req.user מוזן על ידי middleware ה-protect
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};
