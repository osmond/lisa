import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from '../Lightbox.jsx'

test('keyboard navigation and close', () => {
  const images = [
    { src: 'a.jpg', caption: 'first' },
    { src: 'b.jpg', caption: 'second' },
  ]
  const onClose = jest.fn()
  const label = 'Photo viewer'
  render(
    <Lightbox images={images} startIndex={0} onClose={onClose} label={label} />
  )
  const dialog = screen.getByRole('dialog', { name: label })
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAttribute('aria-label', label)

  const img = screen.getByAltText(images[0].caption)
  expect(img).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(img).toHaveAttribute('src', 'b.jpg')

  fireEvent.keyDown(window, { key: 'ArrowLeft' })
  expect(img).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalled()
})
