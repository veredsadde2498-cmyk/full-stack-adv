import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../services/api'
import { createTransaction, updateTransaction } from '../store/transactionsSlice'

// טופס תאריך של HTML דורש מחרוזת בפורמט YYYY-MM-DD
const todayIsoDate = () => new Date().toISOString().slice(0, 10)

const getEmptyForm = () => ({
  title: '',
  amount: '',
  type: '',
  category: '',
  date: todayIsoDate()
})

// עמוד אחד שמשמש גם ליצירה (/transactions/new) וגם לעריכה (/transactions/:id/edit),
// לפי אם יש :id בנתיב
function TransactionForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(getEmptyForm)
  const [initialLoading, setInitialLoading] = useState(isEditMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // במצב עריכה - טוענים את הטרנזקציה הקיימת ומאכלסים איתה את הטופס
  useEffect(() => {
    if (!isEditMode) return

    api.get(`/transactions/${id}`)
      .then((response) => {
        const t = response.data
        setFormData({
          title: t.title,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date ? t.date.slice(0, 10) : todayIsoDate()
        })
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'טעינת הטרנזקציה נכשלה')
      })
      .finally(() => setInitialLoading(false))
  }, [id, isEditMode])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ולידציה בסיסית בצד לקוח - לפני שמגיעים לשרת (שמוולדט שוב עם Joi בכל מקרה)
  const validate = () => {
    if (!formData.title.trim()) return 'כותרת היא שדה חובה'
    if (formData.title.trim().length < 3) return 'כותרת חייבת להכיל לפחות 3 תווים'
    if (!formData.amount || Number(formData.amount) <= 0) return 'הסכום חייב להיות גדול מ-0'
    if (!formData.type) return 'יש לבחור סוג תנועה'
    if (!formData.category.trim()) return 'קטגוריה היא שדה חובה'
    if (formData.category.trim().length < 2) return 'קטגוריה חייבת להכיל לפחות 2 תווים'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    const payload = { ...formData, amount: Number(formData.amount) }

    try {
      if (isEditMode) {
        await dispatch(updateTransaction({ id, data: payload })).unwrap()
      } else {
        await dispatch(createTransaction(payload)).unwrap()
      }
      navigate('/dashboard')
    } catch (err) {
      const message = err?.errors?.join(', ') || err?.message || 'השמירה נכשלה, נסי שוב'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="main-container" dir="rtl">
        <p>טוען...</p>
      </div>
    )
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>{isEditMode ? 'עריכת טרנזקציה' : 'טרנזקציה חדשה'}</h2>

      {error && <p style={{ color: '#dc3545' }}>{error}</p>}

      {/* noValidate - מבטלים את הוולידציה הטבעית של הדפדפן (כולל ה-min על amount)
          כדי שתמיד יוצג רק הטקסט של validate() למעלה, לא הודעות ברירת מחדל */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>כותרת:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label>סכום:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>סוג:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="" disabled>בחרי סוג</option>
            <option value="income">הכנסה</option>
            <option value="expense">הוצאה</option>
          </select>
        </div>

        <div className="form-group">
          <label>קטגוריה:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            maxLength={50}
            required
          />
        </div>

        <div className="form-group">
          <label>תאריך:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'שומרת...' : 'שמירה'}
        </button>
      </form>
    </div>
  )
}

export default TransactionForm
