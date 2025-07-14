import { render } from '@testing-library/react'
import SummaryStrip from '../SummaryStrip.jsx'

test('progress bar width reflects completed ratio', () => {
  const { getByTestId } = render(<SummaryStrip completed={3} total={5} />)
  const inner = getByTestId('summary-progress-bar-inner')
  expect(inner.style.width).toBe('60%')
})
