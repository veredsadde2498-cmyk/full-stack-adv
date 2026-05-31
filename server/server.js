const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();

const app = express();

// הגדרות חובה (Middleware)
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL); // מחבר לקישור שיהיה ב-.env

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('שגיאה בחיבור למונגו:', error);
});
db.once('open', () => {
    console.log('connected to mongo - החיבור למונגו הצליח!');
});

// ייבוא הראוטר של הפוסטים (תוסיפי את זה למעלה או לפני ה-routes)
const postRouter = require('./routes/index');

// שימוש בראוטר - כל פנייה ל- localhost:5000/post תגיע לכאן
app.use('/post', postRouter);


// נתיב בדיקה קצר בדפדפן
app.get('/', (req, res) => {
    res.send('Vefinance Server is running!');
});

// הפורט של השרת
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});