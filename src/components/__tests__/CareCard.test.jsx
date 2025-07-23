import { render, screen, fireEvent, act } from '@testing-library/react'
import { Drop, Sun } from 'phosphor-react'
import CareCard from '../CareCard.jsx'

test('renders label, status, info and progress width', () => {
  render(
    <CareCard
      label="Water"
      Icon={Drop}
      progress={0.5}
      status="Due in 3 days"
      info="200 mL every 9 days"
    />,
  )
  expect(screen.getByText('Water')).toBeInTheDocument()
  expect(screen.getByText(/due in 3 days/i)).toBeInTheDocument()
  expect(screen.getByText(/200 mL every 9 days/i)).toBeInTheDocument()
  const bar = screen.getByRole('progressbar').firstChild
  expect(bar).toHaveStyle('width: 50%')
})

test('calls handler when done', async () => {
  jest.useFakeTimers()
  const onDone = jest.fn()
  render(
    <CareCard label="Water" Icon={Drop} progress={0} status="Today" onDone={onDone} />
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /mark as done/i }))
    jest.runAllTimers()
  })

  expect(onDone).toHaveBeenCalled()
  jest.useRealTimers()
})

test('shows sprout icon for fertilize card when completed', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <CareCard label="Fertilize" Icon={Sun} progress={0} status="Today" onDone={() => {}} />
  )
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /mark as done/i }))
  })
  expect(container.querySelector('.sprout-bounce')).toBeInTheDocument()
  await act(async () => {
    jest.runAllTimers()
  })

  jest.useRealTimers()
})

test('highlights overdue status', () => {
  render(
    <CareCard
      label="Water"
      Icon={Drop}
      progress={0}
      status="Overdue"
      overdue
    />,
  )
  const status = screen.getByText(/overdue/i)
  expect(status).toHaveClass('text-red-600')
  expect(status).toHaveClass('font-semibold')
})
