import { render, screen } from '@testing-library/react'
import SummaryStrip from '../SummaryStrip.jsx'

test('displays summary counts', () => {
  render(<SummaryStrip total={10} watered={3} fertilized={1} />)
  expect(screen.getByTestId('summary-total')).toHaveTextContent('10')
  expect(screen.getByTestId('summary-water')).toHaveTextContent('3')
  expect(screen.getByTestId('summary-fertilize')).toHaveTextContent('1')
})

