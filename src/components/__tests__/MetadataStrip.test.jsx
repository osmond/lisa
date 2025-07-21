import { render, screen } from '@testing-library/react'
import MetadataStrip from '../MetadataStrip.jsx'

const plant = {
  light: 'Bright',
  humidity: 'High',
  waterPlan: { interval: 7 },
  difficulty: 'Easy',
}

test('renders badges with plant metadata', () => {
  render(<MetadataStrip plant={plant} />)
  expect(screen.getByText('Bright')).toBeInTheDocument()
  expect(screen.getByText('High')).toBeInTheDocument()
  expect(screen.getByText('Water every 7d')).toBeInTheDocument()
  expect(screen.getByText('Easy')).toBeInTheDocument()
  const badges = screen.getAllByText(/Bright|High|Water every 7d|Easy/)
  expect(badges).toHaveLength(4)
})
