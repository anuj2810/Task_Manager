import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register({ api }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setMessage(''); setLoading(true)
    try { await api('/auth/register/', 'POST', { username, email, password }); setMessage('Registered! You can login now.') }
    catch (err) { setMessage('Registration failed') }
    finally { setLoading(false) }
  }
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Create your account</h2>
      <Card title="Create account" subtitle="Join Task Tracker">
        <form className="grid gap-3" onSubmit={submit}>
          <Input label="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {message && <div className="text-sm">{message}</div>}
          <Button disabled={loading}>{loading ? 'Creating…' : 'Register'}</Button>
          <p className="text-xs text-gray-600">You can login after registration. Demo: demo/demo12345.</p>
        </form>
      </Card>
    </div>
  )
}