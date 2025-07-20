import express from 'express'

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

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`API server listening on ${port}`)
})
