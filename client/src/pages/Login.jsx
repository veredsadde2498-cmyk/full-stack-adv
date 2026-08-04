import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

// עמוד התחברות - מחובר עכשיו ל-POST /api/auth/login דרך axios
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

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
      login(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'אירעה שגיאה בהתחברות, נסי שוב')
    } finally {
      setLoading(false)
    }
  }

  // הצלחה ב-Google Sign-In - שולחים את ה-credential (ID token) לשרת לאימות,
  // ומטפלים בתשובה בדיוק כמו login רגיל (אותה פונקציית login() מ-useAuth)
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/google', { credential: credentialResponse.credential })
      login(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'ההתחברות עם Google נכשלה, נסי שוב')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('ההתחברות עם Google נכשלה, נסי שוב')
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0', color: '#888' }}>
        <hr style={{ flex: 1 }} />
        <span>או</span>
        <hr style={{ flex: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </div>

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
