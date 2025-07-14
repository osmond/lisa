import { NavLink } from 'react-router-dom'
import {
  Leaf,
  Tree,
  Flower,
  FlowerLotus,
  Cactus,
} from 'phosphor-react'
import AddActionsMenu from './AddActionsMenu.jsx'

const iconProps = {
  size: 24,
  'aria-hidden': 'true',
}


const HomeIcon = ({ active, ...props }) => (
  <Leaf weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const PlantsIcon = ({ active, ...props }) => (
  <Tree weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const CareIcon = ({ active, ...props }) => (
  <Flower weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const GalleryIcon = ({ active, ...props }) => (
  <FlowerLotus weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)
const ProfileIcon = ({ active, ...props }) => (
  <Cactus weight={active ? 'fill' : 'regular'} {...iconProps} {...props} />
)



export default function BottomNav({ dueCount = 0 }) {
  const items = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/myplants', label: 'Plants', icon: PlantsIcon },
    { type: 'add' },
    { to: '/tasks', label: 'Care', icon: CareIcon },
    { to: '/gallery', label: 'Gallery', icon: GalleryIcon },
    { to: '/profile', label: 'Profile', icon: ProfileIcon },
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
                  ? 'text-km-accent bg-soft-leaf-light dark:bg-gray-700'
                  : 'text-km-muted'
              }`
            }
          >
            {({ isActive }) => {
              const Icon = item.icon
              return (
                <>
                  <Icon active={isActive} className={`mb-1 ${isActive ? 'nav-active' : ''}`} />
                  <span className={`relative ${isActive ? 'block' : 'hidden'}`}>
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
