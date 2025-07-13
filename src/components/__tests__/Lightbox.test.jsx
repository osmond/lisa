import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from '../Lightbox.jsx'

test('keyboard navigation and close', () => {
  const images = ['a.jpg', 'b.jpg']
  const onClose = jest.fn()
  render(<Lightbox images={images} startIndex={0} onClose={onClose} />)

  const img = screen.getByAltText(/gallery image/i)
  expect(img).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(img).toHaveAttribute('src', 'b.jpg')

  fireEvent.keyDown(window, { key: 'ArrowLeft' })
  expect(img).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalled()
})
