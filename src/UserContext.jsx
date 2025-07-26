import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [username, setUsername] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('username')
      if (stored) return stored
    }
    return ''
  })
  const [timeZone, setTimeZone] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('timeZone')
      if (stored) return stored
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('username', username)
    }
  }, [username])

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('timeZone', timeZone)
    }
  }, [timeZone])

  return (
    <UserContext.Provider value={{ username, setUsername, timeZone, setTimeZone }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
