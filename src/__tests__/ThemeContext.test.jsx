import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext.jsx'

function Dummy() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

test('toggleTheme updates root class and localStorage', async () => {
  localStorage.setItem('theme', 'light')

  render(
    <ThemeProvider>
      <Dummy />
    </ThemeProvider>
  )

  expect(document.documentElement.classList.contains('dark')).toBe(false)
  expect(screen.getByTestId('theme')).toHaveTextContent('light')

  fireEvent.click(screen.getByText('toggle'))

  await waitFor(() =>
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  )
  expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  expect(localStorage.getItem('theme')).toBe('dark')
})
