import fs from 'fs'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext.jsx'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

function ToggleButton() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}

test('index.css defines plant-themed gradients for both themes', () => {
  const css = fs.readFileSync('src/index.css', 'utf8')
  expect(css).toMatch(/body \{[^}]*linear-gradient/)
  expect(css).toMatch(/\.dark body \{[^}]*linear-gradient/)
})

test('ThemeProvider toggles dark mode class', () => {
  render(
    <ThemeProvider>
      <ToggleButton />
    </ThemeProvider>
  )
  const html = document.documentElement
  expect(html.classList.contains('dark')).toBe(false)
  fireEvent.click(screen.getByRole('button'))
  expect(html.classList.contains('dark')).toBe(true)
})
