export function getWaterPlan(plantName = '', diameter = 0) {
  const d = Number(diameter) || 0
  const depth = d * 0.75
  const radius = d / 2
  const volume = Math.round(Math.PI * radius * radius * depth)
  const name = plantName.toLowerCase()
  let interval = 7
  if (/cactus|succulent|jade|aloe|snake/.test(name)) interval = 14
  else if (/fern/.test(name)) interval = 3
  else if (/orchid/.test(name)) interval = 10
  return { volume, interval }
}

export function getSmartWaterPlan(plantName = '', diameter = 0, forecast = {}) {
  const base = getWaterPlan(plantName, diameter)
  let interval = base.interval
  let reason = 'standard recommendation'
  const temp = parseFloat(forecast?.temp)
  if (!isNaN(temp) && temp > 85) {
    interval = Math.max(1, interval - 1)
    reason = 'adjusted for hot weather'
  } else if (forecast?.rainfall > 60) {
    interval += 1
    reason = 'rain expected'
  }
  return { volume: base.volume, interval, reason }
}
