import { createContext, useContext, useState } from 'react'
import {
  House,
  ListBullets,
  CalendarBlank,
  UserCircle,
  List,
} from 'phosphor-react'

const MenuContext = createContext()

export const defaultMenu = {
  items: [
    { to: '/', label: 'Home', Icon: House },
    { to: '/myplants', label: 'My Plants', Icon: ListBullets },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/profile', label: 'Profile', Icon: UserCircle },
  ],
  Icon: List,
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(defaultMenu)
  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => useContext(MenuContext)
