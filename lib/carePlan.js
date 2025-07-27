export function validateCarePlanInput(data = {}) {
  const required = ['name', 'diameter']
  const missing = required.filter(k => data[k] === undefined || data[k] === '')
  return missing
}

function withDefaults(data = {}) {
  return {
    soil: 'potting mix',
    light: 'Medium',
    room: '',
    humidity: 50,
    ...data,
  }
}

export async function generateCarePlan(data, fetchImpl = fetch, apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY) {
  const missing = validateCarePlanInput(data)
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(', ')}`)
    err.status = 400
    throw err
  }
  if (!apiKey) {
    const err = new Error('Missing OpenAI API key')
    err.status = 400
    throw err
  }

  const details = withDefaults(data)

  const messages = [
    { role: 'system', content: 'You are a helpful plant care assistant.' },
    {
      role: 'user',
      content: `Plant: ${details.name}\nDiameter: ${details.diameter}\nSoil: ${details.soil}\nLight: ${details.light}\nRoom: ${details.room}\nHumidity: ${details.humidity}`,
    },
  ]

  const response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'gpt-4o', messages }),
  })

  if (!response.ok) {
    const err = new Error('Failed to fetch plan')
    err.status = 500
    throw err
  }

  const dataJson = await response.json()
  const text = dataJson?.choices?.[0]?.message?.content?.trim() || ''
  let plan
  try {
    plan = JSON.parse(text)
  } catch {
    plan = { text }
  }
  plan.text = text
  return plan
}
