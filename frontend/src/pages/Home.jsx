import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-64 w-64 bg-indigo-200/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-cyan-200/40 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Organize tasks beautifully</h1>
              <p className="mt-3 text-gray-700">Plan, filter, and track your work with a clean interface, secure auth, and fast performance.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/register"><Button>Get started</Button></Link>
                <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Card title="Highlights" subtitle="Everything you need">
                <ul className="text-gray-700 list-disc pl-5">
                  <li>JWT login and protected routes</li>
                  <li>Powerful filters and search</li>
                  <li>Clean, responsive UI components</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Fast" subtitle="Instant feedback">
            <p className="text-gray-700">Hot reload and responsive UI deliver a smooth experience across devices.</p>
          </Card>
          <Card title="Secure" subtitle="JWT auth">
            <p className="text-gray-700">Register and log in securely. Only authenticated users access the dashboard.</p>
          </Card>
          <Card title="Flexible" subtitle="Filters & search">
            <p className="text-gray-700">Find tasks quickly by status, priority, and text search.</p>
          </Card>
        </div>
      </section>
    </>
  )
}