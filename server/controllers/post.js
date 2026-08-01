// פונקציה לדוגמה שמחזירה רשימת פוסטים/תגובה
const getPosts = async (req, res) => {
    try {
        res.status(200).json({ message: "getPosts works!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// מייצאים את הפונקציה כדי ש-routes/index.js יוכל למצוא אותה
module.exports = {
    getPosts
};