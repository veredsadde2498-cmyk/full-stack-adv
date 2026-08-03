import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// מצרף אוטומטית טוקן JWT מ-localStorage לכל בקשה, אם קיים
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// אם השרת מחזיר 401 - הטוקן לא תקין או פג תוקף, מנקים אותו ומפנים להתחברות.
// לא מפעילים את זה על בקשת login עצמה: שם 401 אומר "פרטי התחברות שגויים",
// לא "טוקן פג תוקף" - וצריך לתת לקומפוננטה של Login להציג את הודעת השגיאה
// במקום לקפוץ ישר בחזרה לאותו עמוד
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
