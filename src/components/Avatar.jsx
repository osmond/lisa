import React from 'react'

export default function Avatar({ name = '', className = '' }) {
  const initials = name
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 font-semibold ${className}`}
    >
      {initials || '?'}
    </div>
  )
}
