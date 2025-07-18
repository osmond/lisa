import React from 'react'

export default function BaseCard({ variant = 'task', className = '', children, ...props }) {
  const base = variant === 'task' ? '' : 'rounded-2xl p-4'
  const variants = {
    task: '',
    summary: 'border dark:border-gray-600 bg-white dark:bg-gray-700',
  }
  const variantClass = variants[variant] ?? ''
  return (
    <div className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  )
}
