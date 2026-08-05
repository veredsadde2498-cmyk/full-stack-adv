const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// יוצרים את תיקיית uploads/ אם היא עוד לא קיימת - בלי זה diskStorage ייכשל
// בפעם הראשונה שמנסים להעלות קובץ
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // timestamp + מספר רנדומלי - כדי ששני קבצים לא ידרסו זה את זה גם אם
        // מעלים באותה מילישניה בדיוק, בתוספת הסיומת המקורית של הקובץ
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// מגביל את סוגי הקבצים המותרים לתמונות בלבד
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('ניתן להעלות רק קבצי JPEG, PNG או WEBP'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// עוטפים את upload.single(...) כדי לתפוס שגיאות Multer (סוג קובץ לא מורשה,
// חריגה מהגודל המותר) ולהעביר אותן ל-error handler הגלובלי עם statusCode 400,
// באותו פורמט אחיד { success:false, message:'...' } כמו כל שאר השגיאות באפליקציה
const handleAvatarUpload = (req, res, next) => {
    upload.single('avatar')(req, res, (error) => {
        if (error) {
            error.statusCode = 400;
            if (error.code === 'LIMIT_FILE_SIZE') {
                error.message = 'הקובץ גדול מדי - הגודל המקסימלי הוא 5MB';
            }
            return next(error);
        }
        next();
    });
};

module.exports = handleAvatarUpload;
