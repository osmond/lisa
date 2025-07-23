import autoTag from '../autoTag.js'
jest.mock('../../OpenAIContext.jsx', () => ({
  getOpenAIEnabled: () => true,
}))

afterEach(() => {
  global.fetch && (global.fetch = undefined)
})

test('fetches tags from OpenAI', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ tags: ['cat', 'plant'] }),
    })
  )
  const tags = await autoTag('my note')
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/auto-tag',
    expect.any(Object)
  )
  expect(tags).toEqual(['cat', 'plant'])
})

test('returns empty array on failure', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false }))
  const tags = await autoTag('text')
  expect(tags).toEqual([])
})
