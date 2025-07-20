import autoTag from '../autoTag.js'

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  delete process.env.VITE_OPENAI_API_KEY
})

test('fetches tags from OpenAI', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ choices: [{ message: { content: 'cat, plant' } }] }),
    })
  )
  const tags = await autoTag('my note')
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    expect.any(Object)
  )
  expect(tags).toEqual(['cat', 'plant'])
})

test('returns empty array when key missing', async () => {
  const tags = await autoTag('text')
  expect(tags).toEqual([])
})
