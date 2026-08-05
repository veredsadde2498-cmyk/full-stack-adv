import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // בעליית האפליקציה (וגם אחרי F5): אם יש token שמור מ-localStorage,
  // מאמתים אותו מול השרת דרך /auth/me ושולפים את פרטי המשתמש - כדי
  // שרענון דף לא ינתק משתמשת שכבר התחברה
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then((response) => {
        setUser(response.data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // נקראת אחרי login/register מוצלחים - מרכזת את שמירת ה-token ועדכון ה-user
  const login = (userData, token) => {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // מעדכנת שדות בודדים ב-user בלי login/logout מלא - למשל אחרי העלאת תמונת
  // פרופיל, כדי שהיא תופיע מיד בדשבורד בלי לרענן את הדף
  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
