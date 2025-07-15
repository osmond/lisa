import React from 'react'

export default function Badge({ children, Icon, colorClass = 'bg-gray-200 text-gray-800' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${colorClass}`}> 
      {Icon && <Icon className="w-3 h-3" aria-hidden="true" />} 
      {children}
    </span>
  )
}
