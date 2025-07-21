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
  global.fetch && (global.fetch = undefined)
  localStorage.clear()
})

test('fetches taxon suggestions', async () => {
  const data = {
    results: [
      { id: 1, name: 'Aloe vera', preferred_common_name: 'Aloe' },
    ],
  }
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(data) })
  )
  render(<Test query="aloe" />)
  await waitFor(() => screen.getByText('Aloe:Aloe vera'))
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('taxa/autocomplete?q=aloe'),
    expect.any(Object)
  )
})

test('aborts fetch on unmount', async () => {
  const abortMock = jest.fn()
  global.AbortController = jest.fn(() => ({ signal: 's', abort: abortMock }))
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ results: [] }) }))
  const { unmount } = render(<Test query="al" />)
  await waitFor(() => expect(global.fetch).toHaveBeenCalled())
  unmount()
  expect(abortMock).toHaveBeenCalled()
  global.AbortController = undefined
})
