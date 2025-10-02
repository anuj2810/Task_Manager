import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { addTask, updateTask, getTaskById } = useTasks();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const existing = getTaskById(parseInt(id));
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 30) {
      newErrors.title = 'Title must be at most 30 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing && id) {
        await updateTask(parseInt(id), formData)
      } else {
        await addTask(formData)
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-6"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">{isEditing ? '✏️' : '➕'}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p className="text-gray-300 text-lg">
              {isEditing ? 'Update your task details' : 'Add a new task to your workflow'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                    errors.title 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-emerald-500'
                  }`}
                  placeholder="Enter a descriptive title for your task"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.title}
                  </p>
                )}
                <p className={`mt-2 text-xs flex items-center ${formData.title.length > 30 ? 'text-red-400' : 'text-gray-400'}`}>
                  <span className="mr-1">{formData.title.length > 30 ? '⚠️' : '✏️'}</span>
                  {formData.title.length}/30 characters — title cannot exceed 30
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none ${
                    errors.description 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-emerald-500'
                  }`}
                  placeholder="Provide detailed information about what needs to be done..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Status and Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Field */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="pending" className="bg-slate-800">⏳ Pending</option>
                      <option value="completed" className="bg-slate-800">✅ Completed</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400 flex items-center">
                    <span className="mr-1">{getStatusIcon(formData.status)}</span>
                    Current status of the task
                  </p>
                </div>

                {/* Priority Field */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-200 mb-2">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="low" className="bg-slate-800">🌱 Low</option>
                      <option value="medium" className="bg-slate-800">⚡ Medium</option>
                      <option value="high" className="bg-slate-800">🔥 High</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400 flex items-center">
                    <span className="mr-1">{getPriorityIcon(formData.priority)}</span>
                    Task importance level
                  </p>
                </div>
              </div>

              {/* Due Date Field */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-200 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 backdrop-blur-sm ${
                    errors.due_date 
                      ? 'border-red-500/50 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-emerald-500'
                  }`}
                />
                {errors.due_date && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.due_date}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  📅 When should this task be completed?
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || formData.title.length > 30}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">{isEditing ? '💾' : '✨'}</span>
                      {isEditing ? 'Update Task' : 'Create Task'}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Card */}
          <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Tips for Better Task Management
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 text-emerald-400">•</span>
                Use clear, action-oriented titles (e.g., "Review Q4 budget proposal")
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-emerald-400">•</span>
                Include specific details in the description to avoid confusion later
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-emerald-400">•</span>
                Set realistic due dates with some buffer time for unexpected delays
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-emerald-400">•</span>
                Use priority levels to focus on what matters most
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;