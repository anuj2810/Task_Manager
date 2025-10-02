export default function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
