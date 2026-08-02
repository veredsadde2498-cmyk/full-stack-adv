const Transaction = require('../models/Transaction');

// יצירת טרנזקציה חדשה - מקבל את הנתונים מה-body ושומר במסד
const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// שליפת כל הטרנזקציות שקיימות באוסף
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// שליפת טרנזקציה בודדת לפי ה-id שמגיע בפרמטר של ה-URL
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'טרנזקציה לא נמצאה' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// עדכון טרנזקציה קיימת - new: true מחזיר את המסמך אחרי העדכון (ולא לפני)
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!transaction) {
            return res.status(404).json({ error: 'טרנזקציה לא נמצאה' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// מחיקת טרנזקציה לפי id
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'טרנזקציה לא נמצאה' });
        }
        res.status(200).json({ message: 'הטרנזקציה נמחקה בהצלחה' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
