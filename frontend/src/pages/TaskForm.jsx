import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function TaskForm({ token, api, navigate }) {
  const params = new URLSearchParams(location.search)
  const editingId = params.get('id')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('pending')
  useEffect(() => {
    (async () => {
      if (editingId) {
        const data = await api(`/tasks/${editingId}/`, 'GET', null, token)
        setTitle(data.title); setDescription(data.description || ''); setPriority(data.priority); setStatus(data.status); setDueDate(data.due_date || '')
      }
    })()
  }, [editingId])
  const submit = async (e) => {
    e.preventDefault()
    const body = { title, description, priority, status, due_date: dueDate || null }
    if (editingId) await api(`/tasks/${editingId}/`, 'PUT', body, token)
    else await api('/tasks/', 'POST', body, token)
    navigate('/dashboard')
  }
  return (
    <div className="max-w-xl mx-auto p-6">
      <Card title={editingId ? 'Edit Task' : 'New Task'}>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Description</span>
            <textarea className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none border-gray-300" rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
          </label>
          <Input label="Due Date" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Priority</span>
              <select className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={priority} onChange={e=>setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Status</span>
              <select className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}