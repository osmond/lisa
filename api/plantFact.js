const cache = new Map()

export async function getPlantFact(name) {
  const key = name.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  let fact = ''
  const openaiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const prompt = `Give me a short fun or cultural fact about the plant "${name}". One sentence.`
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        fact = data?.choices?.[0]?.message?.content?.trim() || ''
      }
    } catch (err) {
      console.error('OpenAI error', err)
    }
  }

  if (!fact) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        fact = data.extract?.split(/\.\s/)[0]?.trim() || ''
      }
    } catch (err) {
      console.error('Wiki error', err)
    }
  }

  if (fact) {
    cache.set(key, fact)
  }
  return fact
}

export default async function plantFactHandler(req, res) {
  const name = req.query.name
  if (!name) return res.status(400).json({ error: 'name required' })
  const fact = await getPlantFact(name)
  if (fact) {
    res.json({ fact })
  } else {
    res.status(500).json({ error: 'Failed to fetch fact' })
  }
}
