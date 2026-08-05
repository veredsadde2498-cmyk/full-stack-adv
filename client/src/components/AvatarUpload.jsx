import { useRef, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// כתובת השרת (בלי /api) - avatarUrl שמגיע מהשרת הוא נתיב יחסי כמו "/uploads/xxx.jpg"
const SERVER_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

// אייקון placeholder גנרי - עיגול אפור עם צללית משתמש, מוצג כשאין avatarUrl בכלל
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ccc'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23fff'/%3E%3Cpath d='M20 88c0-22 14-34 30-34s30 12 30 34' fill='%23fff'/%3E%3C/svg%3E"

// עיגול תמונת פרופיל + כפתור החלפה - לחיצה על התמונה עצמה או על הכפתור
// פותחת את בורר הקבצים. מציג תצוגה מקדימה מיידית (מקומית, לפני שהשרת אישר)
// ואז שולח את הקובץ כ-multipart/form-data ל-PUT /api/auth/avatar
function AvatarUpload() {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef(null)

  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const avatarSrc = preview || (user?.avatarUrl ? `${SERVER_ORIGIN}${user.avatarUrl}` : PLACEHOLDER_AVATAR)

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'ניתן להעלות רק קבצי JPEG, PNG או WEBP'
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `הקובץ גדול מדי - הגודל המקסימלי הוא ${MAX_SIZE_MB}MB`
    return ''
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      e.target.value = '' // מאפשר לבחור שוב את אותו קובץ אחרי שגיאה
      return
    }

    setError('')
    // שומרים ב-const מקומי, לא סומכים על ה-state preview בהמשך הפונקציה -
    // setPreview לא מעדכן את המשתנה preview באותו closure באופן סינכרוני
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    // FormData ולא JSON - זו בקשת multipart/form-data, לא application/json
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await api.put('/auth/avatar', formData)
      updateUser({ avatarUrl: response.data.user.avatarUrl })
    } catch (err) {
      setError(err.response?.data?.message || 'העלאת התמונה נכשלה')
    } finally {
      // מנקים preview תמיד (גם בהצלחה, לא רק בכישלון) - אחרת הוא נשאר תפוס
      // לתמיד ב-blob URL המקומי, ומסתיר כל עדכון עתידי ל-user.avatarUrl
      // מה-context כל עוד הקומפוננטה נשארת mounted (למשל העלאה שנייה)
      URL.revokeObjectURL(objectUrl)
      setPreview(null)
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <img
        src={avatarSrc}
        alt="תמונת פרופיל"
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          objectFit: 'cover',
          cursor: 'pointer',
          border: '1px solid #ccc'
        }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'מעלה...' : 'שנה תמונה'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {error && <p style={{ color: '#dc3545', fontSize: '13px', margin: 0, textAlign: 'center' }}>{error}</p>}
    </div>
  )
}

export default AvatarUpload
