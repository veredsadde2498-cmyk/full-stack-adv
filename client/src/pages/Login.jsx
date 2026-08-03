import { useState } from 'react'
import { Link } from 'react-router-dom'

// עמוד התחברות - כרגע רק UI ומבנה, בלי חיבור אמיתי ל-API (זה יגיע בשלב הבא)
function Login() {
  const [formData, setFormData] = useState({
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
    // TODO: חיבור אמיתי ל-POST /api/auth/login בשלב הבא
    console.log('נתוני התחברות (placeholder):', formData)
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>התחברות למערכת</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">התחבר</button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <Link
          to="/register"
          style={{ background: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer' }}
        >
          אין לך חשבון? הרשם כאן
        </Link>
      </div>
    </div>
  )
}

export default Login
