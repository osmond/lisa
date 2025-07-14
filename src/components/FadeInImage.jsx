import { useRef } from 'react'
import useInView from '../utils/useInView.js'

export default function FadeInImage({ className = '', onError, ...props }) {
  const ref = useRef(null)
  const visible = useInView(ref)

  const handleError = e => {
    if (onError) onError(e)
    if (e.target.src !== '/placeholder.svg') {
      e.target.src = '/placeholder.svg'
    }
  }

  return (
    <img
      ref={ref}
      className={`${className} ${visible ? 'animate-fade-in' : ''}`}
      onError={handleError}
      {...props}
    />
  )
}
