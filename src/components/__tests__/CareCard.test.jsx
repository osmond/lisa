import { render, screen, fireEvent } from '@testing-library/react'
import { Drop } from 'phosphor-react'
import CareCard from '../CareCard.jsx'

test('renders label, status and progress width', () => {
  render(<CareCard label="Water" Icon={Drop} progress={0.5} status="Due in 3 days" />)
  expect(screen.getByText('Water')).toBeInTheDocument()
  expect(screen.getByText(/due in 3 days/i)).toBeInTheDocument()
  const bar = screen.getByRole('progressbar').firstChild
  expect(bar).toHaveStyle('width: 50%')
})

test('calls handler when done', () => {
  jest.useFakeTimers()
  const onDone = jest.fn()
  render(<CareCard label="Water" Icon={Drop} progress={0} status="Today" onDone={onDone} />)
  fireEvent.click(screen.getByRole('button', { name: /mark as done/i }))
  jest.advanceTimersByTime(250)
  expect(onDone).toHaveBeenCalled()
  jest.useRealTimers()
})
