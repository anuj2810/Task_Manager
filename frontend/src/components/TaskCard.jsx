import React, { memo } from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/15 text-green-300 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
    default:
      return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'medium':
      return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    case 'low':
      return 'bg-green-500/15 text-green-300 border-green-500/30';
    default:
      return 'bg-gray-500/15 text-gray-300 border-gray-500/30';
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

const TaskCard = ({ task, onClick, onDelete }) => {
  return (
    <div
      className="relative group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(task)}
    >
      {/* Gradient ring */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        background: 'radial-gradient(80% 100% at 0% 0%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(80% 100% at 100% 100%, rgba(147,51,234,0.15) 0%, transparent 60%)'
      }}></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getStatusIcon(task.status)}</span>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
              {task.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)} {task.priority}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Due: {new Date(task.due_date).toLocaleDateString()}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            title="Delete task"
            className="text-red-300 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md px-2 py-1 text-xs transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3 relative z-10">
        {task.description}
      </p>

      {/* Bottom accent gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

export default memo(TaskCard);