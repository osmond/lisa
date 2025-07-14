import {
  Sun,
  CloudSun,
  CloudRain,
  Cloud,
  CloudLightning,
  Snowflake,
} from 'phosphor-react'
import React from 'react'

export const weatherIconMap = {
  Clear: Sun,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Clouds: Cloud,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
}

export default function WeatherIcon({ condition, className }) {
  const Icon = weatherIconMap[condition] || CloudSun
  return <Icon aria-hidden="true" className={className} data-testid="weather-icon" />
}
