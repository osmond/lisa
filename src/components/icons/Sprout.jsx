import React from 'react'

export default function Sprout({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 21v-8" />
      <path d="M12 13c-2-3-5-5-9-5 1 4 4 7 9 7" fill="currentColor" />
      <path d="M12 13c2-3 5-5 9-5-1 4-4 7-9 7" fill="currentColor" />
    </svg>
  )
}
