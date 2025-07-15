import { useRef } from 'react'
import { createRipple } from './interactions.js'

export default function useRipple() {
  const ref = useRef(null)

  const handler = e => createRipple(e, ref.current)

  return [ref, handler]
}
