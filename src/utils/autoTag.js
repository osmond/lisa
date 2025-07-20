export default async function autoTag(text = '') {
  const apiKey = process.env.VITE_OPENAI_API_KEY
  if (!apiKey || !text) return []
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
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
    if (!res.ok) throw new Error('openai failed')
    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content || ''
    return raw
      .split(/[,\n]+/)
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean)
  } catch (err) {
    console.error('autoTag error', err)
    return []
  }
}
