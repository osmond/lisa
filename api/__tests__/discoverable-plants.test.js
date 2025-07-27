/** @jest-environment node */
import request from 'supertest'
let app

jest.mock('cloudinary', () => ({
  v2: { config: jest.fn(), uploader: { upload_stream: jest.fn() } },
}))

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({})),
}))

beforeAll(async () => {
  ;({ default: app } = await import('../server.js'))
})

test('returns array of discoverable plants', async () => {
  const res = await request(app).get('/api/discoverable-plants')
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body)).toBe(true)
  expect(res.body.length).toBeGreaterThan(0)
})

test('exclude query omits specified names', async () => {
  const all = await request(app).get('/api/discoverable-plants')
  const res = await request(app)
    .get('/api/discoverable-plants')
    .query({ exclude: 'Fiddle Leaf Fig,Boston Fern' })
  expect(res.status).toBe(200)
  const names = res.body.map(p => p.name)
  expect(names).not.toContain('Fiddle Leaf Fig')
  expect(names).not.toContain('Boston Fern')
  expect(res.body.length).toBe(all.body.length - 2)
})
