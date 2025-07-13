import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from '../Lightbox.jsx'

test('keyboard navigation and close', () => {
  const images = ['a.jpg', 'b.jpg']
  const descriptions = ['Image A', 'Image B']
  const onClose = jest.fn()
  render(
    <Lightbox images={images} descriptions={descriptions} startIndex={0} onClose={onClose} />
  )

  const img = screen.getByAltText(descriptions[0])
  expect(img).toHaveAttribute('src', 'a.jpg')

  fireEvent.keyDown(window, { key: 'ArrowRight' })
  expect(img).toHaveAttribute('src', 'b.jpg')
  expect(img).toHaveAttribute('alt', descriptions[1])

  fireEvent.keyDown(window, { key: 'ArrowLeft' })
  expect(img).toHaveAttribute('src', 'a.jpg')
  expect(img).toHaveAttribute('alt', descriptions[0])

  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalled()
})
