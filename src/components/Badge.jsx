import React from 'react'

export default function Badge({
  children,
  Icon,
  variant,
  colorClass,
  size = 'base',
}) {
  const variants = {
    info: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-600',
    complete: 'bg-green-100 text-green-800',
  }

  const cls = colorClass || variants[variant] || 'bg-gray-200 text-gray-800'

  const sizeClasses = {
    base: 'px-2 py-0.5 text-badge',
    sm: 'px-1.5 py-0 text-[10px]',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.base

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} ${cls}`}
    >
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
      {children}
    </span>
  )
}
