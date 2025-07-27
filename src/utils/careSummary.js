export const SPECIES_RULES = [
  { regex: /(cactus|succulent|aloe|jade|snake)/i, kc: 0.3, distance: '< 2 ft from a window', growthMonths: 24 },
  { regex: /fern/i, kc: 0.7, distance: '3-6 ft from a window', growthMonths: 12 },
  { regex: /orchid/i, kc: 0.5, distance: '2-4 ft from a window', growthMonths: 18 },
]

export function getSpeciesInfo(name = '') {
  const entry = SPECIES_RULES.find(r => r.regex.test(name))
  return entry || { kc: 0.5, distance: '< 3 ft from a window', growthMonths: 18 }
}

export function estimateET0(tempC = 20, humidity = 50, radiation = 5, wind = 2) {
  const es = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3))
  const ea = es * (humidity / 100)
  const delta = (4098 * es) / Math.pow(tempC + 237.3, 2)
  const gamma = 0.065
  const rn = radiation
  const g = 0
  const et0 =
    (0.408 * delta * (rn - g) +
      gamma * (900 / (tempC + 273)) * wind * (es - ea)) /
    (delta + gamma * (1 + 0.34 * wind))
  return Math.max(0, Number(et0.toFixed(2)))
}

import { cubicInchesToMl, mlToOz } from './volume.js'

export function generateCareSummary(name, diameter = 0, light = 'Medium', forecast = {}) {
  const { kc, distance, growthMonths } = getSpeciesInfo(name)
  const d = Number(diameter) || 0
  const radius = d / 2
  const depth = d * 0.75
  const volumeIn3 = Math.PI * radius * radius * depth
  const soilMl = cubicInchesToMl(volumeIn3)
  const tempNum = parseFloat(String(forecast.temp || '').replace(/[^\d.-]/g, ''))
  const tempC = isNaN(tempNum) ? 20 : forecast.temp?.toString().includes('F') ? (tempNum - 32) * (5 / 9) : tempNum
  const humidity = forecast.humidity ?? 50
  const et0 = estimateET0(tempC, humidity)
  const lightFactor = /direct/i.test(light) ? 1.2 : /low/i.test(light) ? 0.8 : 1
  const dailyLoss = et0 * kc * volumeIn3 * lightFactor
  const interval = dailyLoss > 0 ? Math.max(1, Math.round((soilMl * 0.25) / dailyLoss)) : 7
  const volumeMl = Math.round(soilMl * 0.25)
  const volumeOz = Math.round(mlToOz(volumeMl))
  return {
    waterPlan: { interval, volume_ml: volumeMl, volume_oz: volumeOz },
    placement: distance,
    repot: `Repot after ${growthMonths} months or when roots fill the pot`,
  }
}
