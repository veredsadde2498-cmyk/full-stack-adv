import { useState } from 'react'
import './index.css'

function App() {
  // מצב שקובע אם אנחנו במסך התחברות (true) או הרשמה (false)
  const [isLogin, setIsLogin] = useState(true)

  // שדות הטופס
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  })

  // עדכון השדות בזמן הקלדה
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // שליחת הטופס לשרת
  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = isLogin ? '/login' : '/register'
    
    try {
      // עדכנו כאן את הפורט ל-5000 במקום 3000
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      alert(data.message || 'הפעולה בוצעה בהצלחה!')
    } catch (error) {
      console.error('שגיאה בתקשורת עם השרת:', error)
      alert('אירעה שגיאה בחיבור לשרת')
    }
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>{isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>שם משתמש:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
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
        )}

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

        <button type="submit">
          {isLogin ? 'התחבר' : 'הירשם'}
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer' }}
        >
          {isLogin ? 'אין לך חשבון? הרשם כאן' : 'יש לך כבר חשבון? התחבר כאן'}
        </button>
      </div>
    </div>
  )
}

export default App