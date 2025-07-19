import { render, screen, fireEvent } from '@testing-library/react'
import FertilizeProgress from '../FertilizeProgress.jsx'

test('renders sun icons with correct colors', () => {
  const { container } = render(<FertilizeProgress completed={1} total={3} />)
  const drops = screen.getAllByTestId('fert-drop')
  expect(drops).toHaveLength(3)
  const svgs = container.querySelectorAll('svg')
  expect(svgs[0].getAttribute('class')).toMatch(/text-yellow-500/)
  expect(svgs[1].getAttribute('class')).toMatch(/text-gray-400/)
})

test('shows bloom when all complete', () => {
  render(<FertilizeProgress completed={2} total={2} />)
  expect(screen.getByRole('img', { name: 'Bloom' })).toBeInTheDocument()
})

test('tap creates ripple', () => {
  const { container } = render(<FertilizeProgress completed={0} total={1} />)
  const drop = screen.getByTestId('fert-drop')
  fireEvent.mouseDown(drop)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})
