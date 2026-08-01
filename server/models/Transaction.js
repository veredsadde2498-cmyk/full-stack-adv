const mongoose = require('mongoose');

// סכמת תנועה עסקית (הכנסה/הוצאה) ששייכת למשתמש מסוים
const transactionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // מקשר לדוקומנט מתאים באוסף Users
            required: true
        }
    },
    {
        timestamps: true // מוסיף אוטומטית createdAt ו-updatedAt
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
