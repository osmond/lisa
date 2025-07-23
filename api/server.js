import 'dotenv/config'
import express from 'express'
import fs from 'fs'

const plantsPath = new URL('../src/plants.json', import.meta.url)
// Load the plants data to allow for future expansion
JSON.parse(fs.readFileSync(plantsPath))
const discoverPath = new URL('../src/discoverablePlants.json', import.meta.url)
const discoverable = JSON.parse(fs.readFileSync(discoverPath))
const app = express()
app.use(express.json())

app.post('/api/coach', async (req, res) => {
  const { question, plantType, lastWatered, weather } = req.body || {}
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
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
    res.status(500).json({ error: 'Failed to fetch coach answer' })
  }
})

app.post('/api/care-plan', async (req, res) => {
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(400).json({ error: 'Missing OpenAI API key' })
    return
  }

  const { name, soil, light, humidity } = req.body || {}
  const messages = [
    {
      role: 'system',
      content:
        'You are a plant care assistant. Respond in JSON with water, fertilize, light, water_volume_ml and water_volume_oz.',
    },
    {
      role: 'user',
      content: `Plant: ${name}\nLight: ${light}\nSoil: ${soil}\nHumidity: ${humidity}\nGive watering interval in days, watering volume in mL and ounces, fertilizing interval in days, and short light description. Respond with JSON {"water":<days>,"fertilize":<days>,"light":"label","water_volume_ml":<ml>,"water_volume_oz":<oz>}.`,
    },
  ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o', messages }),
    })
    if (!response.ok) throw new Error(await response.text())
    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    let plan
    try {
      plan = JSON.parse(text)
    } catch {
      plan = { text }
    }
    const { water_volume_ml, water_volume_oz } = plan
    plan.water_volume_ml = Number(water_volume_ml)
    plan.water_volume_oz = Number(water_volume_oz)
    plan.text = text
    res.json(plan)
  } catch (err) {
    console.error('OpenAI error', err)
    res.status(500).json({ error: 'Failed to generate plan' })
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
app.listen(port, () => {
  console.log(`API server listening on ${port}`)
})
