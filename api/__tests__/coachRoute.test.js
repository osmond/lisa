/** @jest-environment node */
import request from 'supertest'
let app

process.env.OPENAI_API_KEY = 'test-key'

jest.mock('cloudinary', () => ({
  v2: { config: jest.fn(), uploader: { upload_stream: jest.fn() } },
}))

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({})),
}))

afterEach(() => {
  global.fetch = undefined
})

beforeAll(async () => {
  ;({ default: app } = await import('../server.js'))
})

test('returns answer from OpenAI', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'hi' } }] }),
    }),
  )
  const res = await request(app)
    .post('/api/coach')
    .send({ question: 'How water?', plantType: 'Rose' })
  expect(res.status).toBe(200)
  expect(res.body.answer).toBe('hi')
})

test('validates missing question', async () => {
  const res = await request(app)
    .post('/api/coach')
    .send({ plantType: 'Rose' })
  expect(res.status).toBe(400)
})

test('handles OpenAI failure', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('fail')))
  const res = await request(app)
    .post('/api/coach')
    .send({ question: 'hi', plantType: 'Rose' })
  expect(res.status).toBe(502)
  expect(res.body.error).toMatch(/Failed/)
})
