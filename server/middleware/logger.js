// מדפיס לכל בקשה שמגיעה לשרת: זמן, method ו-URL - עוזר למעקב ולדיבאג
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
};

module.exports = logger;
