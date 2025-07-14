import { render, screen } from '@testing-library/react'
import PhotoTimeline from '../PhotoTimeline.jsx'
import data from '../../photoMetadata.json'

function uniqueMonths() {
  const set = new Set(data.map(p => p.date.slice(0, 7)))
  return Array.from(set)
}

test('renders a heading for each month of photos', () => {
  render(<PhotoTimeline />)
  const headings = screen.getAllByRole('heading', { level: 3 })
  expect(headings).toHaveLength(uniqueMonths().length)
})

test('displays all photos', () => {
  render(<PhotoTimeline />)
  const imgs = screen.getAllByRole('img')
  expect(imgs).toHaveLength(data.length)
})
