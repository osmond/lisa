import { createContext, useContext, useEffect, useState } from 'react'

const OpenAIContext = createContext({ enabled: false, setEnabled: () => {} })

export function OpenAIProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('openai_enabled')
      if (stored != null) return stored === 'true'
    }
    return true
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('openai_enabled', enabled)
    }
  }, [enabled])

  return (
    <OpenAIContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </OpenAIContext.Provider>
  )
}

export const useOpenAI = () => useContext(OpenAIContext)

export function getOpenAIEnabled() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('openai_enabled')
    if (stored != null) return stored === 'true'
  }
  return true
}
