import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import AvatarUpload from './AvatarUpload'

// "ערוך פרופיל" בדשבורד - תמונה (AvatarUpload) + עריכת שם, ביחד.
// עובד זהה למשתמש שנרשם רגיל או דרך Google - owner תמיד מ-req.user בשרת,
// לא נוגעים באימייל בכלל (לא מוצג כאן, לא נשלח, לא ניתן לעריכה)
function EditProfile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('שם הוא שדה חובה')
      return
    }

    setError('')
    setSaving(true)

    try {
      const response = await api.put('/auth/profile', { name: trimmedName })
      updateUser({ name: response.data.user.name })
    } catch (err) {
      setError(err.response?.data?.message || 'עדכון השם נכשל')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-block">
      <AvatarUpload />

      <form onSubmit={handleSave} noValidate className="name-edit-form">
        <h2>שלום,</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'שומר...' : 'שמירה'}
        </button>
      </form>

      {error && <p style={{ color: '#dc3545', fontSize: '13px', margin: 0 }}>{error}</p>}
    </div>
  )
}

export default EditProfile
