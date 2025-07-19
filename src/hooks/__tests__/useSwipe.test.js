import { render, fireEvent } from '@testing-library/react'
import useSwipe from '../useSwipe.js'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

function Test({ onEnd }) {
  const { dx, start, move, end } = useSwipe(onEnd)
  return (
    <div
      data-testid="swipe"
      style={{ transform: `translateX(${dx}px)` }}
      onPointerDown={start}
      onPointerMove={move}
      onPointerUp={end}
    />
  )
}

test('calls callback with swipe distance', () => {
  const cb = jest.fn()
  const { getByTestId } = render(<Test onEnd={cb} />)
  const el = getByTestId('swipe')
  fireEvent.pointerDown(el, { clientX: 0, buttons: 1 })
  fireEvent.pointerMove(el, { clientX: 80, buttons: 1 })
  fireEvent.pointerUp(el, { clientX: 80 })
  expect(cb).toHaveBeenCalledWith(80)
})

test('sets pointer capture on pointer down', () => {
  let startFn
  function CaptureTest() {
    const { start } = useSwipe(() => {})
    startFn = start
    return null
  }
  render(<CaptureTest />)
  const mockTarget = { setPointerCapture: jest.fn() }
  startFn({ clientX: 0, pointerId: 1, currentTarget: mockTarget })
  expect(mockTarget.setPointerCapture).toHaveBeenCalledWith(1)
})
