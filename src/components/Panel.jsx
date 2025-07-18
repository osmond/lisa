export default function Panel({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-gray-700 shadow-sm p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
