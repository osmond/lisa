import { generateCarePlan } from '../../lib/carePlan.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const plan = await generateCarePlan(req.body)
    res.status(200).json(plan)
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Failed to generate plan' })
  }
}
