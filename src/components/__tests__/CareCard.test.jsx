import { render, screen, fireEvent, act } from '@testing-library/react'
import { Drop, Sun } from 'phosphor-react'
import CareCard from '../CareCard.jsx'

test('renders label, status and progress width', () => {
  render(<CareCard label="Water" Icon={Drop} progress={0.5} status="Due in 3 days" />)
  expect(screen.getByText('Water')).toBeInTheDocument()
  expect(screen.getByText(/due in 3 days/i)).toBeInTheDocument()
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

test('renders info text when provided', () => {
  render(
    <CareCard
      label="Water"
      Icon={Drop}
      progress={0}
      status="Today"
      info="every 5 days"
      buttonLabel="Water 200 mL / 7 oz"
      infoBelow
      onDone={() => {}}
    />
  )
  expect(
    screen.getByRole('button', { name: /water 200 mL/i })
  ).toBeInTheDocument()
  })

test('uses custom button label when provided', () => {
  render(
    <CareCard label="Water" Icon={Drop} progress={0} status="Today" buttonLabel="Water 500 mL" onDone={() => {}} />
  )
  expect(screen.getByRole('button', { name: /water 500 ml/i })).toBeInTheDocument()
})

test('adds animation when overdue', () => {
  render(
    <CareCard label="Water" Icon={Drop} progress={0.1} status="Overdue" overdue />
  )
  const bar = screen.getByRole('progressbar').firstChild
  expect(bar.className).toMatch(/bar-pulse/)
})
