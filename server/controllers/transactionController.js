const Transaction = require('../models/Transaction');

// יצירת טרנזקציה חדשה - מקבל את הנתונים מה-body ושומר במסד
const createTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        error.statusCode = 400; // שגיאת ולידציה של Mongoose - קלט לא תקין
        next(error);
    }
};

// שליפת כל הטרנזקציות שקיימות באוסף
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

// שליפת טרנזקציה בודדת לפי ה-id שמגיע בפרמטר של ה-URL
const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
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

// עדכון טרנזקציה קיימת - new: true מחזיר את המסמך אחרי העדכון (ולא לפני)
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
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

// מחיקת טרנזקציה לפי id
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
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
