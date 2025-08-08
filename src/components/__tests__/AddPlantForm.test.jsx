import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddPlantForm from '../AddPlantForm.tsx'
import { OpenAIProvider } from '../../OpenAIContext.jsx'

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ url: 'http://example.com/img.jpg' }),
    }),
  )
})

afterEach(() => {
  jest.resetAllMocks()
})

test('uploads file and sets image url', async () => {
  render(
    <OpenAIProvider>
      <AddPlantForm mode="add" onSubmit={() => {}} />
    </OpenAIProvider>,
  )

  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
  const input = screen.getByLabelText(/upload photo/i)
  fireEvent.change(input, { target: { files: [file] } })

  await waitFor(() =>
    expect(screen.getByLabelText(/image url/i)).toHaveValue(
      'http://example.com/img.jpg',
    ),
  )

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/photos',
    expect.objectContaining({ method: 'POST' }),
  )
})

