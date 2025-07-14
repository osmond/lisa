import { useRef } from 'react'
import useInView from '../utils/useInView.js'

export default function FadeInImage({ className = '', ...props }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return <img ref={ref} className={`${className} ${visible ? 'animate-fade-in' : ''}`} {...props} />
}
