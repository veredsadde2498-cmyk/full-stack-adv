// Error handler גלובלי - Express מזהה מידלוור כזה כ"error handler" רק לפי מספר
// הפרמטרים (4 בדיוק: err, req, res, next). אם יחסר אחד מהם זה יתפרש כמידלוור רגיל
// ולא יקלוט שגיאות בכלל.
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || 'אירעה שגיאה בשרת'
    };

    // stack trace רק בסביבת פיתוח - לא לחשוף פרטים פנימיים בפרודקשן
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = globalErrorHandler;
