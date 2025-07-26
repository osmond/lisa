import { render, screen, waitFor } from '@testing-library/react'
import usePlantTaxon from '../usePlantTaxon.js'

function Test({ query }) {
  const results = usePlantTaxon(query)
  return (
    <div>
      {results.map(r => (
        <span key={r.id}>{r.commonName}:{r.scientificName}</span>
      ))}
    </div>
  )
}

afterEach(() => {
  localStorage.clear()
  global.fetch.mockRestore()
})

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, commonName: 'Aloe Vera', scientificName: 'Aloe Vera' },
        ]),
    })
  )
})

test('returns matching suggestions', async () => {
  render(<Test query="Alo" />)
  await waitFor(() => screen.getByText('Aloe Vera:Aloe Vera'))
})

test('ignores short queries', () => {
  render(<Test query="a" />)
  expect(screen.queryByText(/:/)).toBeNull()
})
