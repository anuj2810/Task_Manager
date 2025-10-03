import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { tasks, deleteTask, clearTasks } = useTasks();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // No precreated tasks; start empty for new users

  // Debounce search input for better performance
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Filter tasks based on status and debounced search term
  const filteredTasks = useMemo(() => {
    const lower = debouncedSearch.toLowerCase();
    return tasks.filter((task) => {
      const statusMatch = filter === 'all' || task.status === filter;
      if (!statusMatch) return false;
      if (!lower) return true;
      return (
        task.title.toLowerCase().includes(lower) ||
        task.description.toLowerCase().includes(lower)
      );
    });
  }, [tasks, filter, debouncedSearch]);

  const handleDelete = (id) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;
    deleteTask(id);
  };

  const handleClearAll = async () => {
    if (tasks.length === 0) return;
    const confirmed = window.confirm('Clear all tasks for this account?');
    if (!confirmed) return;
    setError('');
    setIsClearing(true);
    try {
      await clearTasks();
    } catch (e) {
      setError(e.message || 'Failed to clear tasks');
    } finally {
      setIsClearing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '🌱';
      default:
        return '📌';
    }
  };

  // No loading UI needed with local tasks context

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background decoration (non-interactive) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {(() => {
                  const displayName = (user?.name && user.name.trim())
                    || (user?.username && user.username.split('@')[0])
                    || (user?.email && user.email.split('@')[0])
                    || 'User';
                  return (
                    <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{displayName}</span>! 👋</>
                  );
                })()}
              </h1>
              <p className="text-gray-300 text-lg">Here's what you need to focus on today</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/tasks/new')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
              >
                <span className="mr-2">➕</span>
                New Task
              </button>
              <button
                onClick={handleClearAll}
                disabled={isClearing || tasks.length === 0}
                className="bg-white/10 hover:bg-white/20 text-red-300 hover:text-red-200 border border-white/20 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearing ? 'Clearing…' : 'Clear All'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">{tasks.length}</p>
                </div>
                <div className="text-2xl">📋</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.status === 'completed').length}</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>
            {/* Removed unsupported 'in_progress' status */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{tasks.filter(t => t.status === 'pending').length}</p>
                </div>
                <div className="text-2xl">⏳</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === status
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {status === 'all' ? 'All Tasks' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">No tasks found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first task to get started'
                }
              </p>
              <button
                onClick={() => navigate('/tasks/new')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/task/${task.id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;