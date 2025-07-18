import React from 'react'

export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-md mx-auto px-4 py-4 space-y-8 ${className}`.trim()}>
      {children}
    </div>
  )
}
