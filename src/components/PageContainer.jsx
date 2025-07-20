import React from 'react'

const SIZE_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export default function PageContainer({ children, className = '', size = 'md', ...rest }) {
  const maxWidth = SIZE_CLASSES[size] || SIZE_CLASSES.md
  return (
    <div className={`${maxWidth} mx-auto px-4 py-4 space-y-8 ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
