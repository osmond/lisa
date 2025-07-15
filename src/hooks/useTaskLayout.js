import { useState, useEffect } from 'react'

export default function useTaskLayout(key = 'tasksLayout') {
  const [layout, setLayout] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || 'list'
    }
    return 'list'
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, layout)
    }
  }, [key, layout])

  const toggleLayout = () => {
    setLayout(prev => (prev === 'list' ? 'grid' : 'list'))
  }

  return [layout, toggleLayout]
}
