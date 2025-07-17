import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { useEffect } from 'react'
import { Gear } from 'phosphor-react'
import PersistentBottomNav from '../PersistentBottomNav.jsx'
import { MenuProvider, defaultMenu, useMenu } from '../../MenuContext.jsx'

let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

afterEach(() => {
  mockPlants = []
})

const customMenu = {
  ...defaultMenu,
  items: [...defaultMenu.items, { to: '/profile', label: 'Profile', Icon: Gear }],
}

function CustomMenuProvider({ children }) {
  return (
    <MenuProvider>
      <MenuSetter>{children}</MenuSetter>
    </MenuProvider>
  )
}

function MenuSetter({ children }) {
  const { setMenu } = useMenu()
  useEffect(() => {
    setMenu(customMenu)
  }, [])
  return children
}

test('renders main navigation links', () => {
  const { container } = render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )
  expect(container.querySelector('a[href="/"]')).toBeInTheDocument()
  expect(container.querySelector('a[href="/myplants"]')).toBeInTheDocument()
  expect(container.querySelector('a[href="/timeline"]')).toBeInTheDocument()
})

test('more menu opens and closes with additional links', () => {
  const { container } = render(
    <MemoryRouter>
      <CustomMenuProvider>
        <PersistentBottomNav />
      </CustomMenuProvider>
    </MemoryRouter>
  )
  const button = screen.getByRole('button', { name: /open navigation menu/i })
  fireEvent.click(button)
  const overlay = screen.getByRole('dialog', { name: /navigation menu/i })
  expect(overlay).toBeInTheDocument()
  expect(overlay).toHaveClass('backdrop-blur-sm')
  expect(container.querySelector('a[href="/profile"]')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
  expect(screen.queryByRole('dialog', { name: /navigation menu/i })).toBeNull()

})

test('shows overdue count on My Plants when tasks exist', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants = [
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-01',
      nextFertilize: '2025-07-05',
    },
  ]
  render(
    <MemoryRouter>
      <MenuProvider>
        <PersistentBottomNav />
      </MenuProvider>
    </MemoryRouter>
  )
  const badge = screen.getByLabelText(/overdue tasks/i)
  expect(badge).toHaveTextContent('2')
  jest.useRealTimers()
})
