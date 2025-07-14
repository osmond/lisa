import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [name, setName] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('userName')
      if (stored) return stored
    }
    return ''
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userName', name)
    }
  }, [name])

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
