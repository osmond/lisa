import { render, screen } from '@testing-library/react'
import CareStats from '../CareStats.jsx'

test('renders stats with numbers and icons', () => {
  const { container } = render(
    <CareStats
      waterCompleted={1}
      waterTotal={2}
      fertCompleted={2}
      fertTotal={2}
    />
  )
  expect(screen.getByTestId('stat-water')).toBeInTheDocument()
  expect(screen.getByTestId('stat-fertilize')).toBeInTheDocument()
  expect(screen.getByTestId('stat-total')).toBeInTheDocument()
  expect(screen.getByLabelText('3 of 4 tasks done')).toBeInTheDocument()
  expect(screen.getByLabelText('1 of 2 water tasks done')).toBeInTheDocument()
  expect(screen.getByLabelText('2 of 2 fertilize tasks done')).toBeInTheDocument()
  const svgs = container.querySelectorAll('svg')
  expect(svgs.length).toBe(6)
  svgs.forEach(svg => {
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
  ;['stat-total', 'stat-water', 'stat-fertilize'].forEach(id => {
    const inner = screen.getByTestId(id).querySelector('div.absolute')
    const icon = inner.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })
  const texts = screen.getAllByTestId('stat-text').map(el => el.textContent)
  expect(texts).toEqual(['3/4', '1/2', '2/2'])
})

test('rings use accessible color classes', () => {
  const { container } = render(
    <CareStats waterCompleted={1} waterTotal={2} fertCompleted={2} fertTotal={2} />
  )
  const getCircle = id =>
    screen.getByTestId(id).querySelector('svg circle')
  expect(getCircle('stat-total')).toHaveClass('text-emerald-600')
  expect(getCircle('stat-water')).toHaveClass('text-sky-500')
  expect(getCircle('stat-fertilize')).toHaveClass('text-amber-600')
})

test('ring colors remain in dark mode', () => {
  document.documentElement.classList.add('dark')
  const { container } = render(
    <CareStats waterCompleted={1} waterTotal={2} fertCompleted={2} fertTotal={2} />
  )
  const getCircle = id =>
    screen.getByTestId(id).querySelector('svg circle')
  expect(getCircle('stat-total')).toHaveClass('text-emerald-600')
  expect(getCircle('stat-water')).toHaveClass('text-sky-500')
  expect(getCircle('stat-fertilize')).toHaveClass('text-amber-600')
  document.documentElement.classList.remove('dark')
})

test('container has vertical margins for spacing', () => {
  render(<CareStats />)
  expect(screen.getByTestId('care-stats')).toHaveClass('my-4')
})
