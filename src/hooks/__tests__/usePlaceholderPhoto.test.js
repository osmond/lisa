import { render, screen } from '@testing-library/react'
import usePlaceholderPhoto from '../usePlaceholderPhoto.js'

const originalFetch = global.fetch

function Test({ name }) {
  const photo = usePlaceholderPhoto(name)
  return <div>{photo ? photo.src : 'loading'}</div>
}

afterEach(() => {
  localStorage.clear()
  global.fetch = originalFetch
})

test('reads cached photo from localStorage', () => {
  const cached = { src: 'cached.jpg', attribution: 'Placeholder' }
  localStorage.setItem('placeholder_aloe', JSON.stringify(cached))
  render(<Test name="aloe" />)
  expect(screen.getByText('cached.jpg')).toBeInTheDocument()
})

test('uses Wikipedia when not cached', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ thumbnail: { source: 'wiki.jpg' } }),
    })
  )
  render(<Test name="aloe" />)
  expect(await screen.findByText('wiki.jpg')).toBeInTheDocument()
  const stored = JSON.parse(localStorage.getItem('placeholder_aloe'))
  expect(stored.src).toBe('wiki.jpg')
  expect(stored.attribution).toBe('Photo from Wikipedia')
})

test('falls back to placeholder when Wikipedia fails', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('fail')))
  render(<Test name="rose" />)
  expect(await screen.findByText('/placeholder.svg')).toBeInTheDocument()
  const stored = JSON.parse(localStorage.getItem('placeholder_rose'))
  expect(stored.src).toBe('/placeholder.svg')
  expect(stored.attribution).toBe('Placeholder')
})
