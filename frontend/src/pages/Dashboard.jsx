import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';

const Dashboard = () => {
  const { tasks, deleteTask, clearTasks } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // No precreated tasks; start empty for new users

  // Filter tasks based on status and search term
  useEffect(() => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, filter, searchTerm]);

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
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.username || 'User'}</span>! 👋
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
              <div
                key={task.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getStatusIcon(task.status)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                        {task.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                      title="Delete task"
                      className="text-red-300 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md px-2 py-1 text-xs transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Task Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* Task Footer */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <div className="text-xs text-gray-400">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;