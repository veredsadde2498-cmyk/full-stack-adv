const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        },
        avatarUrl: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true // מוסיף אוטומטית createdAt ו-updatedAt
    }
);

// מצפין את הסיסמה לפני שמירה - רק אם היא שונתה (לא בכל save, כדי לא להצפין
// הצפנה חדשה מעל האש קיים בכל עדכון של שדה אחר כמו name)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// משווה סיסמה גולמית מול ההאש השמור - משמש בזמן login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
