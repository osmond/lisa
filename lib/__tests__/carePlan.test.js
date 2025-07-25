/** @jest-environment node */
import { generateCarePlan, validateCarePlanInput } from '../carePlan.js'

test('validateCarePlanInput detects missing fields', () => {
  const missing = validateCarePlanInput({ name: 'Aloe' })
  expect(missing).toContain('diameter')
  expect(missing).toContain('soil')
})

test('throws error when API key missing', async () => {
  await expect(
    generateCarePlan({ name: 'A', diameter: 4, soil: 'pot', light: 'Low', room: 'Office', humidity: 50 }, () => Promise.resolve({ ok: true, json: () => Promise.resolve({ choices: [{ message: { content: '{}' } }] }) }), '')
  ).rejects.toThrow('Missing OpenAI API key')
})


test('returns plan text on success', async () => {
  const fakeFetch = () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ choices: [{ message: { content: '{"water":7}' } }] }),
    })
  const plan = await generateCarePlan(
    { name: 'A', diameter: 4, soil: 'pot', light: 'Low', room: 'Office', humidity: 50 },
    fakeFetch,
    'key'
  )
  expect(plan.text).toBe('{"water":7}')
})
