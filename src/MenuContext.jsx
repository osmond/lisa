import { createContext, useContext, useState } from 'react'
import {
  House,
  Flower,
  CalendarBlank,
  UserCircle,
  Heart,
  List,
} from 'phosphor-react'

const MenuContext = createContext()

export const defaultMenu = {
  items: [
    { to: '/', label: 'Today', Icon: House },
    { to: '/myplants', label: 'All Plants', Icon: Flower },
    { to: '/timeline', label: 'Timeline', Icon: CalendarBlank },
    { to: '/wishlist', label: 'Wishlist', Icon: Heart },
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
