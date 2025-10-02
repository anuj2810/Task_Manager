import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function Dashboard({ token, api, navigate }) {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ status: '', priority: '', search: '', ordering: 'created_at' })
  const [page, setPage] = useState(1)
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v) })
      params.append('page', page)
      const data = await api(`/tasks/?${params.toString()}`, 'GET', null, token)
      setItems(data.results || [])
    })()
  }, [filters, page, token])
  return (
    <div className="max-w-7xl mx-auto p-6 grid gap-6">
      <Card title="Your Tasks" actions={<Button onClick={() => navigate('/task')}>Add Task</Button>}>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <select className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={filters.status} onChange={e=>setFilters(f=>({ ...f, status: e.target.value }))}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" value={filters.priority} onChange={e=>setFilters(f=>({ ...f, priority: e.target.value }))}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search" value={filters.search} onChange={e=>setFilters(f=>({ ...f, search: e.target.value }))} />
        </div>
        {items.length === 0 && (
          <div className="text-sm text-gray-600">No tasks found. Try adjusting filters or add a new task.</div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(t => (
            <Card key={t.id} title={t.title} subtitle={t.description} actions={<Button size="sm" onClick={() => navigate(`/task?id=${t.id}`)}>Edit</Button>}>
              <div className="flex items-center gap-2">
                <Badge color={t.status === 'completed' ? 'green' : 'amber'}>{t.status}</Badge>
                <Badge color={t.priority === 'high' ? 'red' : t.priority === 'medium' ? 'blue' : 'gray'}>{t.priority}</Badge>
                <span className="text-sm text-gray-600">Due: {t.due_date || '-'}</span>
              </div>
              <div className="mt-3">
                <Button variant="danger" size="sm" onClick={async () => { await api(`/tasks/${t.id}/`, 'DELETE', null, token); setItems(items.filter(x=>x.id!==t.id)) }}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}