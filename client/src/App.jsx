import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

// כל עמוד נטען ב-chunk נפרד רק כשמנווטים אליו בפועל, לא כחלק מה-bundle הראשוני
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TransactionForm = lazy(() => import('./pages/TransactionForm'))
const NotFound = lazy(() => import('./pages/NotFound'))

// מוצג לרגע בזמן שה-chunk של העמוד הבא נטען מהרשת
function PageLoadingFallback() {
  return (
    <div className="main-container" dir="rtl">
      <p>טוען...</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions/new"
            element={
              <PrivateRoute>
                <TransactionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions/:id/edit"
            element={
              <PrivateRoute>
                <TransactionForm />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
