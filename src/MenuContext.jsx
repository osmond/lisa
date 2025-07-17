import { createContext, useContext, useState } from 'react'
import {
  House,
  CalendarBlank,
  Plus,
  Image,
  Hamburger,
} from 'phosphor-react'

const MenuContext = createContext()

export const defaultMenu = {
  items: [
    { to: '/', label: 'Home', Icon: House },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/gallery', label: 'Gallery', Icon: Image },
    { to: '/add', label: 'Add Plant', Icon: Plus },
  ],
  Icon: Hamburger,
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
