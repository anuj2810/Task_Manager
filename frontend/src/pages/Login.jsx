import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login({ onLogin, api }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const data = await api('/auth/token/', 'POST', { username, password })
      onLogin(data.access)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    } finally { setLoading(false) }
  }
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome back</h2>
      <Card title="Login" subtitle="Access your dashboard">
        <form className="grid gap-3" onSubmit={submit}>
          <Input label="Username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="demo" />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="demo12345" />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          <p className="text-xs text-gray-600">Use your account or the demo credentials to explore the dashboard.</p>
        </form>
      </Card>
    </div>
  )
}