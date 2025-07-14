import { render, fireEvent, screen } from '@testing-library/react'
import { UserProvider, useUser } from '../UserContext.jsx'

function TestComponent() {
  const { name, setName } = useUser()
  return (
    <div>
      <span data-testid="name">{name}</span>
      <button onClick={() => setName('Alice')}>set</button>
    </div>
  )
}

describe('UserProvider', () => {
  test('loads name from localStorage', () => {
    localStorage.setItem('name', 'Bob')
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )
    expect(screen.getByTestId('name').textContent).toBe('Bob')
  })

  test('setName persists to localStorage', () => {
    localStorage.clear()
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )
    fireEvent.click(screen.getByText('set'))
    expect(localStorage.getItem('name')).toBe('Alice')
  })
})
