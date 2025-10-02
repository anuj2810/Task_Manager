export default function Badge({ children, color = 'gray' }) {
  const palette = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return <span className={`text-xs px-2 py-1 rounded-full ${palette[color]}`}>{children}</span>
}