# Vefinance

אפליקציית ניהול הכנסות והוצאות אישית — Full Stack (React + Node.js + MongoDB), פרויקט גמר בקורס Full Stack למתקדמים.

Vefinance מאפשרת למשתמש להירשם ולהתחבר (כולל Google Sign-In), לנהל את הטרנזקציות הפיננסיות שלו (הכנסות/הוצאות), לצפות בסיכומים ובמגמות חודשיות, לייצא דוח PDF, ולהעלות תמונת פרופיל — הכל בממשק מאובטח ומוגן לפי משתמש.

## תכונות עיקריות

- הרשמה והתחברות עם אימייל/סיסמה (bcrypt + JWT)
- התחברות עם Google (Google OAuth), בנוסף להתחברות הרגילה
- ניהול טרנזקציות מלא (CRUD): יצירה, צפייה, עריכה, מחיקה
- דשבורד עם סיכומי הכנסות/הוצאות/יתרה בזמן אמת
- השוואת מגמה של 3 חודשים אחרונים (הכנסות/הוצאות, אחוזי שינוי)
- ייצוא סיכום פיננסי כקובץ PDF (כולל תמיכה בעברית)
- העלאת ועריכת תמונת פרופיל ושם משתמש
- הגנת נתונים לפי משתמש (כל משתמש רואה רק את הטרנזקציות שלו)
- Rate limiting והגנות אבטחה (Helmet, בדיקות קלט עם Joi)
- טעינה עצלה (lazy loading) ואופטימיזציית ביצועים (memoization)

## Tech Stack

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs — אימות והצפנת סיסמאות
- google-auth-library — אימות Google Sign-In
- Joi — ולידציית קלט
- Multer — העלאת קבצים
- Helmet, express-rate-limit — אבטחה

**Frontend:**
- React 19 + Vite
- React Router — ניווט
- Redux Toolkit + React Redux — ניהול state לטרנזקציות
- Context API — ניהול session/אימות משתמש
- Axios — תקשורת עם ה-API
- Tailwind CSS
- @react-oauth/google — כפתור Google Sign-In
- jsPDF + jspdf-autotable — ייצוא PDF

## התקנה והרצה מקומית

### דרישות מקדימות
- Node.js (גרסה 18 ומעלה)
- MongoDB רץ מקומית (mongodb://localhost:27017) או חיבור ל-MongoDB Atlas

### שלבים

1. שכפול הפרויקט
   git clone https://github.com/veredsadde2498-cmyk/full-stack-adv.git
   cd full-stack-adv

2. התקנת צד שרת
   cd server
   npm install

   ליצור קובץ .env בתיקיית server/ (לפי הדוגמה ב-.env.example):
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/vefinance
   JWT_SECRET=<מחרוזת סוד אקראית, לפחות 32 תווים>
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=<Client ID מ-Google Cloud Console>

3. התקנת צד לקוח
   cd ../client
   npm install

   ליצור קובץ .env בתיקיית client/ (לפי הדוגמה ב-.env.example):
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=<אותו Client ID כמו בצד השרת>

4. הרצה (בשני טרמינלים נפרדים)
   # טרמינל 1 — שרת
   cd server
   npm run dev

   # טרמינל 2 — לקוח
   cd client
   npm run dev

5. לפתוח בדפדפן: http://localhost:5173

## טבלת API Endpoints

### Auth (/api/auth)

| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| POST | /api/auth/register | הרשמת משתמש חדש | ציבורי |
| POST | /api/auth/login | התחברות עם אימייל/סיסמה | ציבורי |
| POST | /api/auth/google | התחברות/הרשמה עם Google | ציבורי |
| GET | /api/auth/me | פרטי המשתמש המחובר | מוגן |
| PUT | /api/auth/profile | עדכון שם משתמש | מוגן |
| PUT | /api/auth/avatar | העלאת תמונת פרופיל | מוגן |

### Transactions (/api/transactions)

| Method | Endpoint | תיאור | הרשאה |
|---|---|---|---|
| POST | /api/transactions | יצירת טרנזקציה חדשה | מוגן |
| GET | /api/transactions | כל הטרנזקציות של המשתמש המחובר (ממוין לפי תאריך) | מוגן |
| GET | /api/transactions/:id | טרנזקציה בודדת | מוגן |
| PUT | /api/transactions/:id | עדכון טרנזקציה | מוגן |
| DELETE | /api/transactions/:id | מחיקת טרנזקציה | מוגן |

כל ה-endpoints המוגנים דורשים header: Authorization: Bearer <token>.

## Screenshots

_(להוסיף צילומי מסך של הממשק — דף התחברות, דשבורד, טופס טרנזקציה — לפני ההגשה הסופית)_

## Team

פרויקט יחיד.

| שם | תפקיד |
|---|---|
| _(להשלים)_ | Full Stack Development |

## קישור לפריסה חיה

_(להשלים לאחר Deployment — שלב 12)_

- Frontend:
- Backend:
