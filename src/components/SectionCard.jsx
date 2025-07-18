export default function SectionCard({ className = '', children, ...props }) {
  return (
    <section className={`rounded-xl bg-white dark:bg-gray-700 shadow-sm p-4 ${className}`} {...props}>
      {children}
    </section>
  )
}
