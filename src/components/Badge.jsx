import React from 'react'

export default function Badge({
  children,
  Icon,
  variant,
  colorClass,
}) {
  const variants = {
    info: 'bg-blue-100 text-blue-800',
    urgent: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-600',
    complete: 'bg-green-100 text-green-800',
  }

  const cls = colorClass || variants[variant] || 'bg-gray-200 text-gray-800'

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-badge font-medium ${cls}`}
    >
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
      {children}
    </span>
  )
}
