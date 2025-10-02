import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskForm from './pages/TaskForm'

export default function AppRouter() {
  const { isAuthenticated, logout } = useAuth()
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated
                ? <Dashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/task"
            element={
              isAuthenticated
                ? <TaskForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/tasks/new"
            element={
              isAuthenticated
                ? <TaskForm />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/task/:id"
            element={
              isAuthenticated
                ? <TaskForm />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
    </>
  )
}