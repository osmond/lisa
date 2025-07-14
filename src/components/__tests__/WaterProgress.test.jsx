import { render, screen, fireEvent } from '@testing-library/react'
import WaterProgress from '../WaterProgress.jsx'

test('renders drops with correct colors', () => {
  const { container } = render(<WaterProgress completed={1} total={3} />)
  const drops = screen.getAllByTestId('water-drop')
  expect(drops).toHaveLength(3)
  const svgs = container.querySelectorAll('svg')
  expect(svgs[0].getAttribute('class')).toMatch(/text-blue-500/)
  expect(svgs[1].getAttribute('class')).toMatch(/text-gray-400/)
})

test('shows bloom when all complete', () => {
  render(<WaterProgress completed={2} total={2} />)
  expect(screen.getByRole('img', { name: 'Bloom' })).toBeInTheDocument()
})

test('tap creates ripple', () => {
  const { container } = render(<WaterProgress completed={0} total={1} />)
  const drop = screen.getByTestId('water-drop')
  fireEvent.mouseDown(drop)
  expect(container.querySelector('.ripple-effect')).toBeInTheDocument()
})
