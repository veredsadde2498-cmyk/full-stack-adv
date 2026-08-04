import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// עוטף routes שדורשים התחברות - בזמן שה-AuthContext עדיין מאמת token
// (loading) לא מציגים כלום, כדי לא "להבהב" למשתמשת מסך login רגע לפני
// שמתברר שהיא כן מחוברת
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
