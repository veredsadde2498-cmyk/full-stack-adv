import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import { fetchTransactions } from '../store/transactionsSlice'

// עמוד דשבורד - עדיין placeholder בסיסי; ה-UI המלא של הטרנזקציות מגיע בשלב הבא
function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const { list, loading } = useSelector((state) => state.transactions)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="main-container" dir="rtl">
      <h2>שלום, {user?.name}</h2>

      {loading ? <p>טוען טרנזקציות...</p> : <p>יש לך {list.length} טרנזקציות</p>}

      <button type="button" onClick={handleLogout} style={{ marginTop: '15px' }}>
        התנתקות
      </button>
    </div>
  )
}

export default Dashboard
