const Joi = require('joi');

// תבנית של ObjectId תקין של MongoDB - 24 תווים הקסדצימליים
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// סכימת יצירה - כל השדות חובה (מלבד date שיש לו default ב-Mongoose)
const createTransactionSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'כותרת היא שדה חובה',
        'string.min': 'כותרת חייבת להכיל לפחות 3 תווים',
        'string.max': 'כותרת יכולה להכיל עד 100 תווים',
        'any.required': 'כותרת היא שדה חובה'
    }),
    amount: Joi.number().positive().required().messages({
        'number.base': 'סכום חייב להיות מספר',
        'number.positive': 'סכום חייב להיות גדול מ-0',
        'any.required': 'סכום הוא שדה חובה'
    }),
    type: Joi.string().valid('income', 'expense').required().messages({
        'any.only': 'סוג התנועה חייב להיות income או expense',
        'string.empty': 'סוג התנועה הוא שדה חובה',
        'any.required': 'סוג התנועה הוא שדה חובה'
    }),
    category: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'קטגוריה היא שדה חובה',
        'string.min': 'קטגוריה חייבת להכיל לפחות 2 תווים',
        'string.max': 'קטגוריה יכולה להכיל עד 50 תווים',
        'any.required': 'קטגוריה היא שדה חובה'
    }),
    date: Joi.date().optional().messages({
        'date.base': 'תאריך לא תקין'
    }),
    owner: Joi.string().pattern(objectIdPattern).required().messages({
        'string.pattern.base': 'owner חייב להיות מזהה תקין (ObjectId בן 24 תווים הקסדצימליים)',
        'string.empty': 'owner הוא שדה חובה',
        'any.required': 'owner הוא שדה חובה'
    })
});

// סכימת עדכון - כל השדות אופציונליים (PUT יכול לעדכן חלק מהשדות בלבד),
// owner לא מופיע בכלל כי הבעלים של טרנזקציה לא אמור להשתנות אחרי היצירה.
// .min(1) מוודא שלא שולחים body ריק שלא מעדכן כלום.
const updateTransactionSchema = Joi.object({
    title: Joi.string().min(3).max(100).messages({
        'string.empty': 'כותרת לא יכולה להיות ריקה',
        'string.min': 'כותרת חייבת להכיל לפחות 3 תווים',
        'string.max': 'כותרת יכולה להכיל עד 100 תווים'
    }),
    amount: Joi.number().positive().messages({
        'number.base': 'סכום חייב להיות מספר',
        'number.positive': 'סכום חייב להיות גדול מ-0'
    }),
    type: Joi.string().valid('income', 'expense').messages({
        'any.only': 'סוג התנועה חייב להיות income או expense'
    }),
    category: Joi.string().min(2).max(50).messages({
        'string.empty': 'קטגוריה לא יכולה להיות ריקה',
        'string.min': 'קטגוריה חייבת להכיל לפחות 2 תווים',
        'string.max': 'קטגוריה יכולה להכיל עד 50 תווים'
    }),
    date: Joi.date().messages({
        'date.base': 'תאריך לא תקין'
    })
}).min(1).messages({
    'object.min': 'יש לספק לפחות שדה אחד לעדכון'
});

module.exports = {
    createTransactionSchema,
    updateTransactionSchema
};
