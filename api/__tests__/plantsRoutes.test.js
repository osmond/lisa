/** @jest-environment node */
import request from 'supertest'

let store
let app

jest.mock('@prisma/client', () => {
  let id = 1
  const data = { plants: [], photos: [], careEvents: [] }
  class PrismaClientKnownRequestError extends Error {
    constructor(message, { code }) {
      super(message)
      this.code = code
    }
  }
  const client = {
    plant: {
      create: ({ data: d }) => {
        const now = new Date()
        const plant = { id: id++, createdAt: now, updatedAt: now, deletedAt: null, ...d }
        data.plants.push(plant)
        return Promise.resolve(plant)
      },
      update: ({ where: { id }, data: d }) => {
        const plant = data.plants.find(p => p.id === id)
        if (!plant) {
          return Promise.reject(
            new PrismaClientKnownRequestError('not found', { code: 'P2025' })
          )
        }
        Object.assign(plant, d)
        if (d) plant.updatedAt = new Date()
        return Promise.resolve(plant)
      },
      delete: ({ where: { id } }) => {
        const index = data.plants.findIndex(p => p.id === id)
        if (index === -1)
          return Promise.reject(
            new PrismaClientKnownRequestError('not found', { code: 'P2025' })
          )
        data.plants.splice(index, 1)
        return Promise.resolve()
      },
    },
    photo: {
      deleteMany: ({ where: { plantId } }) => {
        data.photos = data.photos.filter(p => p.plantId !== plantId)
        return Promise.resolve()
      },
      createMany: ({ data: arr }) => {
        arr.forEach(d => data.photos.push({ id: id++, ...d }))
        return Promise.resolve()
      },
      findMany: ({ where: { plantId }, skip = 0, take = 1 }) => {
        const list = data.photos
          .filter(p => p.plantId === plantId)
          .sort((a, b) => a.id - b.id)
        return Promise.resolve(list.slice(skip, skip + take))
      },
      delete: ({ where: { id } }) => {
        data.photos = data.photos.filter(p => p.id !== id)
        return Promise.resolve()
      },
    },
    careEvent: {
      deleteMany: ({ where: { plantId } }) => {
        data.careEvents = data.careEvents.filter(e => e.plantId !== plantId)
        return Promise.resolve()
      },
    },
    __store: data,
  }
  return {
    PrismaClient: jest.fn(() => client),
    Prisma: { PrismaClientKnownRequestError },
  }
})

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((opts, cb) => ({
        end: () => cb(null, { secure_url: 'http://example.com/img.jpg' }),
      })),
    },
  },
}))

import { PrismaClient } from '@prisma/client'
process.env.DATABASE_URL = 'test'
process.env.NODE_ENV = 'development'
const prisma = new PrismaClient()
store = prisma.__store

beforeAll(async () => {
  ;({ default: app } = await import('../server.js'))
})

beforeEach(() => {
  store.plants.length = 0
  store.photos.length = 0
  store.careEvents.length = 0
})

test('create plant', async () => {
  const res = await request(app).post('/api/plants').send({ name: 'Fern' })
  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('id')
  expect(res.body.name).toBe('Fern')
})

test('create plant validation', async () => {
  const res = await request(app).post('/api/plants').send({ species: 'Fern' })
  expect(res.status).toBe(400)
})

test('update plant', async () => {
  const plant = await prisma.plant.create({ data: { name: 'Old' } })
  const res = await request(app)
    .put(`/api/plants/${plant.id}`)
    .send({ name: 'New' })
  expect(res.status).toBe(200)
  expect(res.body.name).toBe('New')
})

test('update plant validation', async () => {
  const plant = await prisma.plant.create({ data: { name: 'Old' } })
  const res = await request(app)
    .put(`/api/plants/${plant.id}`)
    .send({ name: 123 })
  expect(res.status).toBe(400)
})

test('update missing plant', async () => {
  const res = await request(app).put('/api/plants/999').send({ name: 'Ghost' })
  expect(res.status).toBe(404)
  expect(res.body.error).toMatch(/not found/i)
})

test('delete plant', async () => {
  const plant = await prisma.plant.create({ data: { name: 'Del' } })
  const res = await request(app).delete(`/api/plants/${plant.id}`)
  expect(res.status).toBe(204)
  expect(store.plants[0].deletedAt).toBeInstanceOf(Date)
})

test('delete with invalid id', async () => {
  const res = await request(app).delete('/api/plants/abc')
  expect(res.status).toBe(400)
  expect(res.body.error).toMatch(/invalid/i)
})

test('delete missing plant', async () => {
  const res = await request(app).delete('/api/plants/999')
  expect(res.status).toBe(404)
  expect(res.body.error).toMatch(/not found/i)
})

test('upload photos', async () => {
  const plant = await prisma.plant.create({ data: { name: 'Photo' } })
  const res = await request(app)
    .post(`/api/plants/${plant.id}/photos`)
    .attach('photos', Buffer.from('test'), 'a.jpg')
  expect(res.status).toBe(200)
  expect(res.body.urls).toContain('http://example.com/img.jpg')
})
