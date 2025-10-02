import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const TasksContext = createContext(null)

export const useTasks = () => {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider')
  return ctx
}

export const TasksProvider = ({ children }) => {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])

  // Load tasks from backend when authenticated
  useEffect(() => {
    const load = async () => {
      if (!token) {
        setTasks([])
        return
      }
      try {
        const res = await fetch(`${API_URL}/tasks/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load tasks')
        const data = await res.json()
        // DRF pagination
        const items = Array.isArray(data) ? data : data.results || []
        setTasks(items)
      } catch (e) {
        console.error(e)
        setTasks([])
      }
    }
    load()
  }, [token])

  const addTask = async (data) => {
    if (!token) throw new Error('Not authenticated')
    const payload = {
      title: data.title,
      description: data.description,
      due_date: data.due_date || null,
      priority: data.priority || 'medium',
      status: data.status || 'pending',
    }
    const res = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Failed to create task')
    const created = await res.json()
    setTasks(prev => [created, ...prev])
    return created
  }

  const updateTask = async (id, updates) => {
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update task')
    const updated = await res.json()
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
    return updated
  }

  const deleteTask = async (id) => {
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/tasks/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Failed to delete task')
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const clearTasks = async () => {
    if (!token) throw new Error('Not authenticated')
    const ids = tasks.map(t => t.id)
    try {
      await Promise.all(ids.map(async (id) => {
        const res = await fetch(`${API_URL}/tasks/${id}/`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          throw new Error(`Failed to delete task ${id}`)
        }
      }))
      setTasks([])
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const getTaskById = (id) => tasks.find(t => t.id === id)

  const value = useMemo(() => ({
    tasks,
    addTask,
    updateTask,
    deleteTask,
    clearTasks,
    getTaskById,
  }), [tasks])

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  )
}