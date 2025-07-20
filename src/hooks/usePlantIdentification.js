export default async function identifyPlant(base64Image) {
  const key = process.env.VITE_PLANTID_API_KEY
  if (!key) return null
  const res = await fetch('https://api.plant.id/v2/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': key,
    },
    body: JSON.stringify({
      images: [base64Image],
      modifiers: ['crops_fast', 'health_all'],
      plant_language: 'en',
      disease_details: 'auto',
    }),
  })
  if (!res.ok) throw new Error('Plant.id request failed')
  return res.json()
}
