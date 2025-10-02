export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <input className={`border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} {...props} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
