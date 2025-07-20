let getPlantFact

beforeEach(() => {
  jest.resetModules()
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ extract: 'Test fact. Second' }) })
  )
  ;({ getPlantFact } = require('../plantFact.js'))
})

afterEach(() => {
  global.fetch.mockClear()
})

test('returns fact from wikipedia when OpenAI key missing', async () => {
  const fact = await getPlantFact('Rose')
  expect(fact).toBe('Test fact')
  expect(global.fetch).toHaveBeenCalled()
})

test('caches repeated lookups', async () => {
  global.fetch.mockClear()
  await getPlantFact('Rose')
  await getPlantFact('Rose')
  expect(global.fetch).toHaveBeenCalledTimes(1)
})
