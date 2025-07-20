import React from 'react'

<
/**
 * Wraps page content with consistent padding and a configurable max width.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render inside the container
 * @param {string} [props.maxWidth='xl'] - Tailwind max-w size (e.g. `md`, `lg`)
 * @param {string} [props.className] - Additional classes
 */
export default function PageContainer({
  children,
  className = '',
  maxWidth = 'xl',
  ...rest
}) {
  const widthClass = maxWidth ? `max-w-${maxWidth}` : ''
  return (
    <div
      className={`${widthClass} mx-auto px-4 py-4 space-y-8 ${className}`.trim()}

const SIZE_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export default function PageContainer({
  children,
  className = '',
  size = 'md',
  ...rest
}) {
  const maxWidth = SIZE_CLASSES[size] || SIZE_CLASSES.md
  return (
    <div
      className={`${maxWidth} mx-auto px-4 py-4 space-y-8 ${className}`.trim()}

      {...rest}
    >
      {children}
    </div>
  )
}
