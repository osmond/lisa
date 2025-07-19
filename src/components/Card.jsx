export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`bg-white dark:bg-gray-700 rounded-2xl shadow p-4 ${className}`} {...props}>
      {children}
    </Component>
  )
}
