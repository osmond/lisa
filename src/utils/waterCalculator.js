export const MS_PER_DAY = 86400000

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


export function getSmartWaterPlan(
  plant = {},
  weather = {},
  logs = []
) {
  const base = getWaterPlan(plant.name, plant.diameter)
  let interval = base.interval

  // adjust for weather conditions
  const heat = weather.temp ?? weather.tempHigh
  if (heat && heat > 90) interval -= 2
  if (weather.humidity && weather.humidity < 30) interval -= 1
  if (weather.humidity && weather.humidity > 80) interval += 1
  if (weather.rainfall && weather.rainfall > 60) interval += 2

  // seasonal adjustment by month
  const daylight = weather.daylightHours ?? weather.daylight
  if (typeof daylight === 'number') {
    if (daylight > 13) interval -= 1
    else if (daylight < 10) interval += 1
  } else {
    const month = (weather.date ? new Date(weather.date) : new Date()).getMonth()
    if ([5, 6, 7].includes(month)) interval -= 1
    else if ([11, 0, 1].includes(month)) interval += 1
  }

  // incorporate user logs
  const dates = logs
    .map(l => new Date(l.date))
    .filter(d => !isNaN(d))
    .sort((a, b) => a - b)
  if (dates.length > 1) {
    const total = dates.slice(1).reduce(
      (sum, d, i) => sum + (d - dates[i]) / MS_PER_DAY,
      0
    )
    const avg = total / (dates.length - 1)
    if (avg < base.interval - 1 || avg > base.interval + 1)
      interval = Math.round(avg)
  }

  interval = Math.max(1, Math.round(interval))
  return { volume: base.volume, interval }

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
