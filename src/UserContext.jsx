import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('username')
      if (stored) return stored
    }
    return 'Kay'
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('username', username)
    }
  }, [username])

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
