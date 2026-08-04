import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TransactionForm from './pages/TransactionForm'
import NotFound from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute'
import './index.css'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
