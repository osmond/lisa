import { NavLink } from 'react-router-dom'
import {
  HouseSimple,
  Tree,
  CheckCircle,
  GridFour,
  User,
} from 'phosphor-react'
import AddActionsMenu from './AddActionsMenu.jsx'

const iconProps = {
  size: 24,
  'aria-hidden': 'true',
}


const HomeIconComponent = ({ active, ...props }) => (
  <HouseSimple weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const ListIcon = ({ active, ...props }) => (
  <Tree weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const CheckIcon = ({ active, ...props }) => (
  <CheckCircle weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const GalleryIcon = ({ active, ...props }) => (
  <GridFour weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const UserIcon = ({ active, ...props }) => (
  <User weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)



export default function BottomNav({ dueCount = 0 }) {
  const items = [
    { to: '/', label: 'Home', icon: HomeIconComponent },
    { to: '/myplants', label: 'Plants', icon: ListIcon },
    { type: 'add' },
    { to: '/tasks', label: 'Care', icon: CheckIcon },
    { to: '/gallery', label: 'Gallery', icon: GalleryIcon },
    { to: '/settings', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-800 flex justify-around py-2">

      {items.map(item =>
        item.type === 'add' ? (
          <div key="add" className="w-12 flex flex-col items-center">
            <AddActionsMenu />
          </div>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-12 flex flex-col items-center text-xs transition-transform duration-150 ${
                isActive
                  ? 'text-[#A3C293] bg-green-50 dark:bg-gray-700'
                  : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => {
              const Icon = item.icon
              return (
                <>
                  <Icon active={isActive} className={`mb-1 ${isActive ? 'nav-active' : ''}`} />
                  <span className="relative">
                    {item.label}
                    {item.to === '/tasks' && dueCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-[10px] px-1">
                        {dueCount}
                      </span>
                    )}
                  </span>
                </>
              )
            }}
          </NavLink>
        )
      )}
    </nav>
  )
}
