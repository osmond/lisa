import { render, screen, fireEvent, act } from '@testing-library/react'
import PhotoThumb from '../PhotoThumb.jsx'

beforeAll(() => {
  if (!navigator.share) navigator.share = jest.fn()
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

test('long press shows menu and triggers actions', () => {
  jest.useFakeTimers()
  const onShare = jest.fn()
  const onEdit = jest.fn()
  const onCover = jest.fn()
  const { container } = render(
    <PhotoThumb src="test.jpg" alt="test" onShare={onShare} onEdit={onEdit} onCover={onCover} />
  )
  const wrapper = container.firstChild
  act(() => {
    fireEvent.pointerDown(wrapper, { pointerId: 1 })
    jest.advanceTimersByTime(600)
  })
  fireEvent.pointerUp(wrapper)
  expect(screen.getByRole('menu')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Share'))
  expect(onShare).toHaveBeenCalled()

  act(() => {
    fireEvent.pointerDown(wrapper, { pointerId: 1 })
    jest.advanceTimersByTime(600)
  })
  fireEvent.pointerUp(wrapper)
  fireEvent.click(screen.getByText('Edit Note'))
  expect(onEdit).toHaveBeenCalled()

  act(() => {
    fireEvent.pointerDown(wrapper, { pointerId: 1 })
    jest.advanceTimersByTime(600)
  })
  fireEvent.pointerUp(wrapper)
  fireEvent.click(screen.getByText('Set as Cover'))
  expect(onCover).toHaveBeenCalled()
  jest.useRealTimers()
})

