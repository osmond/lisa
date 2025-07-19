import React from 'react'

export default function Badge({
  children,
  Icon,
  variant,
  colorClass = '',
  className = '',
  size = 'base',
}) {
  const variants = {
    info: 'bg-blue-100 text-blue-800',
    urgent: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-50 text-red-500',
    complete: 'bg-green-100 text-green-800',
  }

  const cls = colorClass || variants[variant] || 'bg-gray-200 text-gray-800'

  const sizeClasses = {
    base: 'px-3 py-1 text-badge',
    sm: 'px-2 py-0.5 text-[10px]',
  }

  const sizeClass = sizeClasses[size] || sizeClasses.base

  const classes = `inline-flex items-center gap-1 rounded-full font-medium shadow-sm ${sizeClass} ${cls} ${className}`.trim()

  return (
    <span
      className={classes}
    >
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
      {children}
    </span>
  )
}
