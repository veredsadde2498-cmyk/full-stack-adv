import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

// עמוד הרשמה - מחובר עכשיו ל-POST /api/auth/register דרך axios
function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // register לא מחזיר token (register לא מתחבר אוטומטית) - רק יוצר משתמש
      await api.post('/auth/register', formData)
      navigate('/login', { state: { message: 'ההרשמה הצליחה! כעת ניתן להתחבר.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'אירעה שגיאה בהרשמה, נסי שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>הרשמה למערכת</h2>

      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

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

        <button type="submit" disabled={loading}>
          {loading ? 'נרשמת...' : 'הירשם'}
        </button>
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
