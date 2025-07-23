import { render, screen } from '@testing-library/react'
import usePlaceholderPhoto from '../usePlaceholderPhoto.js'

function Test({ name }) {
  const photo = usePlaceholderPhoto(name)
  return <div>{photo ? photo.src : 'loading'}</div>
}

afterEach(() => {
  localStorage.clear()
})

test('reads cached photo from localStorage', () => {
  const cached = { src: 'cached.jpg', attribution: 'Unsplash' }
  localStorage.setItem('placeholder_aloe', JSON.stringify(cached))
  render(<Test name="aloe" />)
  expect(screen.getByText('cached.jpg')).toBeInTheDocument()
})

test('uses Unsplash when not cached', () => {
  render(<Test name="aloe" />)
  const text = screen.getByText(/source\.unsplash\.com\/featured\/\?aloe/)
  expect(text).toBeInTheDocument()
  const stored = JSON.parse(localStorage.getItem('placeholder_aloe'))
  expect(stored.src).toMatch(/source\.unsplash\.com/)
})
