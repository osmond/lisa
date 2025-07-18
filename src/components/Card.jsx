export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component
      className={`bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
