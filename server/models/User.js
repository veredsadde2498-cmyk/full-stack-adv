const mongoose = require('mongoose');

// סכמת משתמש - כל משתמש רשום במערכת עם ההרשאות שלו
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            select: false // לא לכלול את הסיסמה כברירת מחדל בשליפות (find/findOne)
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true // מוסיף אוטומטית createdAt ו-updatedAt
    }
);

module.exports = mongoose.model('User', userSchema);
