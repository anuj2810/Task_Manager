import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskForm from './pages/TaskForm'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const login = (t) => { localStorage.setItem('token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('token'); setToken('') }
  return { token, login, logout }
}

async function api(path, method='GET', body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text())
  if (res.status === 204) return null
  return await res.json()
}


export default function AppRouter() {
  const auth = useAuth()
  const navigate = useNavigate()
  return (
    <>
      <Navbar authed={!!auth.token} onLogout={() => { auth.logout(); navigate('/') }} />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage onLogin={auth.login} api={api} />} />
          <Route path="/register" element={<Register api={api} />} />
          <Route
            path="/dashboard"
            element={
              auth.token
                ? <Dashboard token={auth.token} api={api} navigate={navigate} />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="/task"
            element={
              auth.token
                ? <TaskForm token={auth.token} api={api} navigate={navigate} />
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </main>
    </>
  )
}