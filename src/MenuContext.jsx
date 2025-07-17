import { createContext, useContext, useState } from 'react'
import {
  House,
  Flower,
  CalendarBlank,
  Plus,
  UserCircle,
  List,
} from 'phosphor-react'

const MenuContext = createContext()

export const defaultMenu = {
  items: [
    { to: '/', label: 'Home', Icon: House },
    { to: '/myplants', label: 'My Plants', Icon: Flower },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/add', label: 'Add Plant', Icon: Plus },
    { to: '/room/add', label: 'Add Room', Icon: Plus },
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
