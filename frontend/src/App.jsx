import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Audits from './pages/Audits'
import AuditDetail from './pages/AuditDetail'
import NewAudit from './pages/NewAudit'
import './App.css'

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/audits" 
          element={isAuthenticated ? <Layout><Audits /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/audits/new" 
          element={isAuthenticated ? <Layout><NewAudit /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/audits/:id" 
          element={isAuthenticated ? <Layout><AuditDetail /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
