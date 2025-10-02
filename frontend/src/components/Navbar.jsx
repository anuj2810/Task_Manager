import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-2xl border-b border-indigo-500/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent hover:from-indigo-300 hover:to-blue-300 transition-all duration-300 tracking-tight"
          >
            🗂️ Task Manager
          </Link>
          <div className="flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/tasks/new" 
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
                >
                  ➕ Add Task
                </Link>
                <button 
                  onClick={logout} 
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
                >
                  🔑 Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🚀 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}