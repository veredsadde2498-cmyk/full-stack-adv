// מידלוור גנרי לוולידציה - מקבל סכימת Joi ומחזיר מידלוור שמריץ אותה על req.body
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // לאסוף את כל שגיאות הולידציה, לא רק את הראשונה
            stripUnknown: true  // להוריד שדות שלא מוגדרים בסכימה (למשל owner ב-update)
        });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value; // מחליפים ב-body המנוקה (אחרי stripUnknown)
        next();
    };
};

module.exports = validate;
