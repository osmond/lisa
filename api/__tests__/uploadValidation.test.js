/** @jest-environment node */
import request from 'supertest'
let app
beforeAll(async () => {
  ;({ default: app } = await import('../server.js'))
})

jest.mock('cloudinary', () => {
  return {
    v2: {
      config: jest.fn(),
      uploader: {
        upload_stream: jest.fn((opts, cb) => {
          return {
            end: () => cb(null, { secure_url: 'http://example.com/img.jpg' }),
          }
        }),
      },
    },
  }
})

const prisma = {
  photo: { createMany: jest.fn(), findMany: jest.fn(), delete: jest.fn() },
  plant: {},
  careEvent: {},
}

jest.mock('@prisma/client', () => {
  const prisma = {
    photo: { createMany: jest.fn(), findMany: jest.fn(), delete: jest.fn() },
    plant: {},
    careEvent: {},
  }
  return { PrismaClient: jest.fn(() => prisma) }
})

describe('photo upload validation', () => {
  test('rejects non-image upload', async () => {
    const res = await request(app)
      .post('/api/plants/1/photos')
      .attach('photos', Buffer.from('data'), {
        filename: 'file.txt',
        contentType: 'text/plain',
      })
    expect(res.status).toBe(400)
  })

  test('rejects large upload', async () => {
    const big = Buffer.alloc(6 * 1024 * 1024)
    const res = await request(app)
      .post('/api/plants/1/photos')
      .attach('photos', big, {
        filename: 'big.jpg',
        contentType: 'image/jpeg',
      })
    expect(res.status).toBe(400)
  })

  test('accepts valid image', async () => {
    const small = Buffer.alloc(1024)
    const res = await request(app)
      .post('/api/plants/1/photos')
      .attach('photos', small, {
        filename: 'ok.jpg',
        contentType: 'image/jpeg',
      })
    expect(res.status).toBe(200)
    expect(res.body.urls).toEqual(['http://example.com/img.jpg'])
  })
})
