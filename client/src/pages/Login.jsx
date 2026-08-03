import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

// עמוד התחברות - מחובר עכשיו ל-POST /api/auth/login דרך axios
function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  // הודעת הצלחה שמגיעה מ-Register.jsx אחרי הרשמה מוצלחת (navigate עם state)
  const successMessage = location.state?.message

  const [formData, setFormData] = useState({
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
      const response = await api.post('/auth/login', formData)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'אירעה שגיאה בהתחברות, נסי שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>התחברות למערכת</h2>

      {successMessage && <p style={{ color: '#28a745' }}>{successMessage}</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

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

        <button type="submit" disabled={loading}>
          {loading ? 'מתחברת...' : 'התחבר'}
        </button>
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
