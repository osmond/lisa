import React from 'react'

export default function BaseCard({ variant = 'task', className = '', children, ...props }) {
  const base = 'rounded-2xl border dark:border-gray-600 shadow-sm p-4'
  const variants = {
    task: '',
    summary: 'bg-white dark:bg-gray-700',
  }
  const variantClass = variants[variant] ?? ''
  return (
    <div className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  )
}
