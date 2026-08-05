const Transaction = require('../models/Transaction');

// יצירת טרנזקציה חדשה - owner נלקח מהמשתמש המחובר (req.user, מוזן ע"י protect),
// לא מה-body שהלקוח שולח - אחרת לקוח יכול היה ליצור טרנזקציה בשם משתמש אחר
const createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            owner: req.user.id
        });
        res.status(201).json(transaction);
    } catch (error) {
        error.statusCode = 400; // שגיאת ולידציה של Mongoose - קלט לא תקין
        next(error);
    }
};

// שליפת כל הטרנזקציות של המשתמש המחובר בלבד, מהחדש לישן לפי תאריך התנועה
// (date, לא createdAt - מתי היא קרתה בפועל, לא מתי היא הוזנה למערכת)
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ owner: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

// שליפת טרנזקציה בודדת - מסננים גם לפי owner כדי שמשתמש לא יוכל לשלוף טרנזקציה
// של מישהו אחר רק על ידי ניחוש ה-id שלה (IDOR). אם היא קיימת אבל שייכת למשתמש
// אחר, מחזירים אותו 404 כמו במקרה שהיא לא קיימת בכלל - לא חושפים את קיומה
const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, owner: req.user.id });
        if (!transaction) {
            const error = new Error('טרנזקציה לא נמצאה');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

// עדכון טרנזקציה קיימת - new: true מחזיר את המסמך אחרי העדכון (ולא לפני).
// אותו סינון owner כמו ב-getTransactionById, כדי שאי אפשר יהיה לעדכן טרנזקציה
// של משתמש אחר
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!transaction) {
            const error = new Error('טרנזקציה לא נמצאה');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json(transaction);
    } catch (error) {
        error.statusCode = 400; // שגיאת ולידציה של Mongoose - קלט לא תקין
        next(error);
    }
};

// מחיקת טרנזקציה - אותו סינון owner, מאותה סיבה
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!transaction) {
            const error = new Error('טרנזקציה לא נמצאה');
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({ message: 'הטרנזקציה נמחקה בהצלחה' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
