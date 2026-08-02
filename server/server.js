const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const logger = require('./middleware/logger');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();

// הגדרות חובה (Middleware)
app.use(cors());
app.use(express.json());

// לוגר גלובלי - רץ על כל בקשה, לפני שהיא מגיעה ל-routes
app.use(logger);

mongoose.connect(process.env.DATABASE_URL); // מחבר לקישור שיהיה ב-.env

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('שגיאה בחיבור למונגו:', error);
});
db.once('open', () => {
    console.log('connected to mongo - החיבור למונגו הצליח!');
});

// ייבוא הראוטר של הטרנזקציות
const transactionRoutes = require('./routes/transactionRoutes');

// שימוש בראוטר - כל פנייה ל- localhost:5000/api/transactions תגיע לכאן
app.use('/api/transactions', transactionRoutes);


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