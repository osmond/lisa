
export default function Button({ className = '', children, ...props }) {
  return (
    <button className={`rounded-lg ${className}`} {...props}>
      {children}
    </button>
  )
}
