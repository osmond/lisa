import { getOpenAIEnabled } from '../OpenAIContext.jsx'

export default async function autoTag(text = '') {
  const enabled = getOpenAIEnabled()
  if (!enabled || !text) return []
  try {
    const res = await fetch('/api/auto-tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error('autoTag failed')
    const data = await res.json()
    return data.tags || []
  } catch (err) {
    console.error('autoTag error', err)
    return []
  }
}
