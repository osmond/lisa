import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import cloudinary from './cloudinary.js'
import { PrismaClient, Prisma } from '@prisma/client'
import { generateCarePlan } from '../lib/carePlan.js'

const discoverPath = path.join(process.cwd(), 'src', 'discoverablePlants.json')
const discoverable = JSON.parse(fs.readFileSync(discoverPath))
const app = express()
// Temporarily increase JSON payload limit while the upload feature is in progress
app.use(express.json({ limit: '100mb' }))

// Cloudinary is configured in cloudinary.js

const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() })

app.post('/api/coach', async (req, res) => {
  const { question, plantType, lastWatered, weather } = req.body || {}
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY

  if (!question) {
    res.status(400).json({ error: 'Missing question' })
    return
  }
  if (!apiKey) {
    res.status(400).json({ error: 'Missing OpenAI API key' })
    return
  }

  const prompt = [
    { role: 'system', content: 'You are a friendly plant care expert.' },
    {
      role: 'user',
      content: `${question}\nPlant type: ${plantType}\nLast watered: ${lastWatered}\nWeather: ${weather?.temp} ${weather?.condition}`,
    },
  ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o', messages: prompt }),
    })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const answer = data?.choices?.[0]?.message?.content?.trim()
    res.json({ answer })
  } catch (err) {
    console.error('OpenAI error', err)
    res.status(502).json({ error: 'Failed to fetch coach answer' })
  }
})

app.post('/api/care-plan', async (req, res) => {
  try {
    const plan = await generateCarePlan(req.body)
    res.json(plan)
  } catch (err) {
    const status = err.status || 500
    console.error('OpenAI error', err)
    res.status(status).json({ error: err.message || 'Failed to generate plan' })
  }
})

app.post('/api/auto-tag', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    res.status(400).json({ error: 'Missing OpenAI API key' })
    return
  }
  const { text = '' } = req.body || {}
  if (!text) {
    res.json({ tags: [] })
    return
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Provide 3 short tags for: "${text}". Respond with a comma-separated list.`,
          },
        ],
        temperature: 0.5,
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content || ''
    const tags = raw
      .split(/[ ,\n]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean)
    res.json({ tags })
  } catch (err) {
    console.error('OpenAI error', err)
    res.status(500).json({ error: 'Failed to generate tags' })
  }
})

app.post('/api/plant-fact', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    res.status(400).json({ error: 'Missing OpenAI API key' })
    return
  }
  const { name } = req.body || {}
  try {
    const prompt = `Give me a short fun or cultural fact about the plant "${name}". One sentence.`
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const fact = data?.choices?.[0]?.message?.content?.trim()
    res.json({ fact })
  } catch (err) {
    console.error('OpenAI error', err)
    res.status(500).json({ error: 'Failed to fetch fact' })
  }
})

app.post('/api/timeline-summary', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    res.status(400).json({ error: 'Missing OpenAI API key' })
    return
  }
  const { events = [] } = req.body || {}
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Summarize the recent plant care events in a friendly, conversational tone that encourages the user. For example: "Looks like your spider plant is thriving after that watering!"',
          },
          { role: 'user', content: JSON.stringify(events) },
        ],
        temperature: 0.7,
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const summary = data?.choices?.[0]?.message?.content?.trim()
    res.json({ summary })
  } catch (err) {
    console.error('OpenAI error', err)
    res.status(500).json({ error: 'Failed to load summary' })
  }
})

// Simple photo upload endpoint
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  const file = req.file
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE || !file.mimetype.startsWith('image/')) {
    res.status(400).json({ error: 'Invalid file upload' })
    return
  }
  try {
    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'plants' },
        (err, result) => {
          if (err) reject(err)
          else resolve(result.secure_url)
        },
      )
      stream.end(file.buffer)
    })
    res.json({ url })
  } catch (err) {
    console.error('Upload error', err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// CRUD routes for plants
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await prisma.plant.findMany({
      include: { photos: true, careEvents: true },
      orderBy: { id: 'asc' },
    })
    res.json(plants)
  } catch (err) {
    console.error('DB error', err)
    res.status(500).json({ error: 'Failed to load plants' })
  }
})

app.post('/api/plants', async (req, res) => {
  try {
    const plant = await prisma.plant.create({ data: req.body })
    res.status(201).json(plant)
  } catch (err) {
    console.error('DB error', err)
    res.status(400).json({ error: 'Failed to create plant' })
  }
})

app.put('/api/plants/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  try {
    const plant = await prisma.plant.update({ where: { id }, data: req.body })
    res.json(plant)
  } catch (err) {
    console.error('DB error', err)
    res.status(400).json({ error: 'Failed to update plant' })
  }
})

app.delete('/api/plants/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid plant id' })
    return
  }
  try {
    await prisma.photo.deleteMany({ where: { plantId: id } })
    await prisma.careEvent.deleteMany({ where: { plantId: id } })
    await prisma.plant.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Plant not found' })
    } else {
      console.error('DB error', err)
      res.status(400).json({ error: 'Failed to delete plant' })
    }
  }
})

app.post('/api/plants/:id/photos', upload.array('photos'), async (req, res) => {
  const plantId = parseInt(req.params.id, 10)
  if (Number.isNaN(plantId)) {
    res.status(400).json({ error: 'Invalid plant id' })
    return
  }
  const files = req.files || []
  if (files.length === 0) {
    res.status(400).json({ error: 'No photos uploaded' })
    return
  }
  const MAX_SIZE = 5 * 1024 * 1024
  const invalid = files.find(
    f => f.size > MAX_SIZE || !f.mimetype.startsWith('image/')
  )
  if (invalid) {
    res.status(400).json({ error: 'Invalid file upload' })
    return
  }
  try {
    const urls = await Promise.all(
      files.map(
        file =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'plants' },
              (err, result) => {
                if (err) reject(err)
                else resolve(result.secure_url)
              },
            )
            stream.end(file.buffer)
          }),
      ),
    )
    await prisma.photo.createMany({
      data: urls.map(url => ({ url, plantId })),
    })
    res.json({ urls })
  } catch (err) {
    console.error('Upload error', err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

app.delete('/api/plants/:id/photos/:index', async (req, res) => {
  const plantId = parseInt(req.params.id, 10)
  const index = parseInt(req.params.index, 10)
  if (Number.isNaN(plantId) || Number.isNaN(index)) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }
  try {
    const photos = await prisma.photo.findMany({
      where: { plantId },
      orderBy: { id: 'asc' },
      skip: index,
      take: 1,
    })
    const photo = photos[0]
    if (photo) await prisma.photo.delete({ where: { id: photo.id } })
    res.status(204).end()
  } catch (err) {
    console.error('Delete photo error', err)
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

app.get('/api/discoverable-plants', (req, res) => {
  const excludeParam = req.query.exclude || ''
  const exclude = excludeParam
    .split(',')
    .map(n => n.trim().toLowerCase())
    .filter(Boolean)
  const list = discoverable.filter(
    p => !exclude.includes(p.name.toLowerCase())
  )
  res.json(list)
})

const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API server listening on ${port}`)
  })
}

export default app
