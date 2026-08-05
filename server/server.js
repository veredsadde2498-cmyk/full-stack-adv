const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const logger = require('./middleware/logger');
const globalErrorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// הגדרות חובה (Middleware)
app.use(helmet()); // מגדיר HTTP headers בסיסיים להגנה (XSS, clickjacking וכו')
app.use(cors());
app.use(express.json());

// לוגר גלובלי - רץ על כל בקשה, לפני שהיא מגיעה ל-routes
app.use(logger);

// הגבלת קצב כללית על כל ה-API - הגנה מפני עומס יתר. authLimiter הספציפי
// והמחמיר יותר על login/register מוגדר בנפרד ב-routes/authRoutes.js
app.use('/api', apiLimiter);

mongoose.connect(process.env.DATABASE_URL); // מחבר לקישור שיהיה ב-.env

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('שגיאה בחיבור למונגו:', error);
});
db.once('open', () => {
    console.log('connected to mongo - החיבור למונגו הצליח!');
});

// ייבוא הראוטרים
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// שימוש בראוטרים - כל פנייה ל- localhost:5000/api/... תגיע לראוטר המתאים
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// מגיש את קבצי התמונות שהועלו (תמונות פרופיל) - סטטית, בלי authLimiter/apiLimiter
// כי זה לא /api ולא endpoint לוגי, רק הגשת קבצים.
// crossOriginResourcePolicy: 'cross-origin' דורס כאן, רק על ה-route הזה, את
// ברירת המחדל המחמירה של helmet() הגלובלי (same-origin) - בלעדיו הדפדפן חוסם
// טעינת <img> מ-localhost:5000 כשהעמוד עצמו רץ על localhost:5173 (origin שונה).
// שאר ה-API (למשל תשובות JSON) נשאר עם ההגנה המחמירה כרגיל - זה ספציפי לתמונות בלבד
app.use(
    '/uploads',
    helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
    express.static(path.join(__dirname, 'uploads'))
);


// נתיב בדיקה קצר בדפדפן
app.get('/', (req, res) => {
    res.send('Vefinance Server is running!');
});

// error handler גלובלי - חייב להיות אחרון, אחרי כל ה-routes
app.use(globalErrorHandler);

// הפורט של השרת
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});