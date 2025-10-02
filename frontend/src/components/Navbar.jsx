import { Link } from 'react-router-dom'
import Button from './ui/Button'

export default function Navbar({ authed, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white shadow">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <Link to={authed ? "/dashboard" : "/"} className="font-semibold tracking-tight text-white hover:text-white/90 transition-colors">Task Tracker</Link>
        <div className="ml-auto flex items-center gap-3">
          {!authed ? (
            <>
              <Link to="/login" className="text-white/90 hover:text-white underline-offset-4 hover:underline">Login</Link>
              <Link to="/register" className="text-white/90 hover:text-white underline-offset-4 hover:underline">Register</Link>
              <Link to="/dashboard" className="text-white/90 hover:text-white underline-offset-4 hover:underline">Dashboard</Link>
            </>
          ) : (
            <Button variant="secondary" className="text-gray-900 hover:shadow-sm" onClick={onLogout}>Logout</Button>
          )}
        </div>
      </nav>
    </header>
  )
}