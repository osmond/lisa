import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [name, setName] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('name')
      if (stored) return stored
    }
    return ''
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('name', name)
    }
  }, [name])

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
