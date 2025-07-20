import identifyPlant from '../usePlantIdentification.js'

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  delete process.env.VITE_PLANTID_API_KEY
})

test('returns null when api key missing', async () => {
  const res = await identifyPlant('img')
  expect(res).toBeNull()
})

test('posts image to plant.id', async () => {
  process.env.VITE_PLANTID_API_KEY = 'key'
  const data = { suggestions: [{ plant_name: 'Oak' }] }
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(data) }))
  const res = await identifyPlant('imgdata')
  expect(global.fetch).toHaveBeenCalledWith('https://api.plant.id/v2/identify', expect.objectContaining({ method: 'POST' }))
  expect(res).toEqual(data)
})
