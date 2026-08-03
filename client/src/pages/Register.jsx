import { useState } from 'react'
import { Link } from 'react-router-dom'

// עמוד הרשמה - כרגע רק UI ומבנה, בלי חיבור אמיתי ל-API (זה יגיע בשלב הבא)
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: חיבור אמיתי ל-POST /api/auth/register בשלב הבא
    console.log('נתוני הרשמה (placeholder):', formData)
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>הרשמה למערכת</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>שם מלא:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>אימייל:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>סיסמה:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">הירשם</button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <Link
          to="/login"
          style={{ background: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer' }}
        >
          יש לך כבר חשבון? התחבר כאן
        </Link>
      </div>
    </div>
  )
}

export default Register
