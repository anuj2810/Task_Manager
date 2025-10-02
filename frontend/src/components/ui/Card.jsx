export default function Card({ title, subtitle, actions, className = '', children }) {
  return (
    <div className={`bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-4 py-3 border-b border-gray-200 flex items-center">
          <div className="flex-1">
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}