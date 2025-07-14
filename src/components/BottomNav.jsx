import { NavLink } from 'react-router-dom'
import {
  CheckCircledIcon,
  HomeIcon,
  ImageIcon,
  ListBulletIcon,
  PersonIcon,
  PlusIcon,
} from '@radix-ui/react-icons'

const iconProps = {
  className: 'w-6 h-6',
  'aria-hidden': 'true',
}

const HomeIconComponent = props => <HomeIcon {...iconProps} {...props} />
const ListIcon = props => <ListBulletIcon {...iconProps} {...props} />
const CheckIcon = props => <CheckCircledIcon {...iconProps} {...props} />
const GalleryIcon = props => <ImageIcon {...iconProps} {...props} />
const AddIcon = props => <PlusIcon {...iconProps} {...props} />
const UserIcon = props => <PersonIcon {...iconProps} {...props} />

export default function BottomNav({ dueCount = 0 }) {
  const items = [
    { to: '/', label: 'Home', icon: HomeIconComponent },
    { to: '/myplants', label: 'My Plants', icon: ListIcon },
    { to: '/tasks', label: `To-Do (${dueCount})`, icon: CheckIcon },
    { to: '/gallery', label: 'Gallery', icon: GalleryIcon },
    { to: '/add', label: 'Add', icon: AddIcon },
    { to: '/settings', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-800 flex justify-around py-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-transform duration-150 ${isActive ? 'text-green-700 scale-110' : 'text-gray-500'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`mb-1 transition-colors duration-150 ${isActive ? 'nav-bounce' : ''}`}
                aria-hidden="true"
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
