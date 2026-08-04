import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import { fetchTransactions, deleteTransaction } from '../store/transactionsSlice'
import MonthlyTrend from '../components/MonthlyTrend'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.transactions)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ייבוא דינמי - jsPDF גורר איתו html2canvas+dompurify (~250KB) שלא נחוצים לנו
  // בכלל (אנחנו לא משתמשים ב-doc.html()), אז לא הגיוני לטעון את זה לכל מי
  // שנכנס לדשבורד - רק כשבאמת לוחצים על "ייצוא ל-PDF"
  const handleExportPdf = async () => {
    if (list.length === 0) {
      alert('אין נתונים לייצוא - הוסיפי טרנזקציה קודם')
      return
    }

    const { exportTransactionsToPdf } = await import('../utils/exportPdf')
    exportTransactionsToPdf(list)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק את הטרנזקציה הזו? לא ניתן לשחזר.')) return

    setDeleteError('')
    try {
      await dispatch(deleteTransaction(id)).unwrap()
    } catch (err) {
      setDeleteError(err?.message || 'מחיקת הטרנזקציה נכשלה')
    }
  }

  // מחשבים סיכומים מתוך ה-list שכבר קיים ב-Redux - בלי endpoint נפרד לזה
  const totals = list.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )
  const balance = totals.income - totals.expense

  return (
    <div className="main-container dashboard-container" dir="rtl">
      <div className="dashboard-header">
        <h2>שלום, {user?.name}</h2>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          התנתקות
        </button>
      </div>

      {loading && <p>טוען...</p>}

      {!loading && error && (
        <div>
          <p style={{ color: '#dc3545' }}>שגיאה בטעינת הטרנזקציות: {error}</p>
          <button type="button" className="btn btn-secondary" onClick={() => dispatch(fetchTransactions())}>
            נסה שוב
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <strong>סה"כ הכנסות</strong>
              <p style={{ color: '#28a745' }}>{totals.income.toLocaleString()} ₪</p>
            </div>
            <div className="summary-card">
              <strong>סה"כ הוצאות</strong>
              <p style={{ color: '#dc3545' }}>{totals.expense.toLocaleString()} ₪</p>
            </div>
            <div className="summary-card">
              <strong>יתרה</strong>
              <p>{balance.toLocaleString()} ₪</p>
            </div>
          </div>

          <MonthlyTrend transactions={list} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/transactions/new" className="btn btn-primary">
              + טרנזקציה חדשה
            </Link>
            <button type="button" className="btn btn-secondary" onClick={handleExportPdf}>
              ייצוא ל-PDF
            </button>
          </div>

          {deleteError && <p style={{ color: '#dc3545', marginTop: '10px' }}>{deleteError}</p>}

          {list.length === 0 ? (
            <p style={{ marginTop: '15px' }}>
              אין עדיין טרנזקציות. <Link to="/transactions/new">הוסיפי את הראשונה שלך</Link>
            </p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>כותרת</th>
                  <th>סכום</th>
                  <th>סוג</th>
                  <th>קטגוריה</th>
                  <th>תאריך</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td>{t.amount.toLocaleString()} ₪</td>
                    <td>{t.type === 'income' ? 'הכנסה' : 'הוצאה'}</td>
                    <td>{t.category}</td>
                    <td>{new Date(t.date).toLocaleDateString('he-IL')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link to={`/transactions/${t._id}/edit`} className="btn btn-primary">
                          עריכה
                        </Link>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(t._id)}>
                          מחיקה
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
