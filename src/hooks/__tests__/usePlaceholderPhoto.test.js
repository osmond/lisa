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
  const cached = { src: 'cached.jpg', attribution: 'Unsplash' }
  localStorage.setItem('placeholder_aloe', JSON.stringify(cached))
  render(<Test name="aloe" />)
  expect(screen.getByText('cached.jpg')).toBeInTheDocument()
})

test('uses Unsplash when not cached', async () => {
  render(<Test name="aloe" />)
  const text = await screen.findByText(/source\.unsplash\.com\/featured\/\?aloe/)
  expect(text).toBeInTheDocument()
  const stored = JSON.parse(localStorage.getItem('placeholder_aloe'))
  expect(stored.src).toMatch(/source\.unsplash\.com/)
})

test('falls back to Wikipedia on Unsplash failure', async () => {
  global.fetch = jest.fn(url => {
    if (url.includes('unsplash')) {
      return Promise.reject(new Error('fail'))
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ thumbnail: { source: 'wiki.jpg' } }),
    })
  })
  render(<Test name="rose" />)
  expect(await screen.findByText('wiki.jpg')).toBeInTheDocument()
  const stored = JSON.parse(localStorage.getItem('placeholder_rose'))
  expect(stored.src).toBe('wiki.jpg')
  expect(stored.attribution).toBe('Photo from Wikipedia')
})
