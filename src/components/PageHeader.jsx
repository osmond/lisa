import Breadcrumb from './Breadcrumb.jsx'

export default function PageHeader({
  title,
  breadcrumb,
  className = '',
  subtitle,
  children,
}) {
  return (
    <header className={`mb-4 space-y-1 text-left ${className}`.trim()}>
      {breadcrumb && <Breadcrumb {...breadcrumb} />}
      {title && (
        <h1 className="text-2xl tracking-wide font-bold font-headline">{title}</h1>
      )}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {children}
    </header>
  )
}
