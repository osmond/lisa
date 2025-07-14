import { render, screen } from '@testing-library/react'
import React from 'react'

global.__PlantContext = React.createContext()
global.__WeatherContext = React.createContext()

jest.mock('../../PlantContext.jsx', () => {
  const React = require('react')
  return {
    usePlants: () => React.useContext(global.__PlantContext),
  }
})

jest.mock('../../WeatherContext.jsx', () => {
  const React = require('react')
  return {
    useWeather: () => React.useContext(global.__WeatherContext),
  }
})

import useDueTasksCount from '../useDueTasksCount.js'

function TestComponent() {
  const count = useDueTasksCount()
  return <div data-testid="count">{count}</div>
}

function renderWith(plants, weather) {
  return render(
    <global.__WeatherContext.Provider value={weather}>
      <global.__PlantContext.Provider value={{ plants }}>
        <TestComponent />
      </global.__PlantContext.Provider>
    </global.__WeatherContext.Provider>
  )
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
})

afterEach(() => {
  jest.useRealTimers()
})

test('counts watering and fertilizing tasks', () => {
  const plants = [
    { id: 1, lastWatered: '2025-07-03' },
    { id: 2, nextFertilize: '2025-07-10' },
  ]
  renderWith(plants, { forecast: { rainfall: 0 }, timezone: 'UTC' })
  expect(screen.getByTestId('count')).toHaveTextContent('2')
})

test('rain postpones watering task', () => {
  const plants = [
    { id: 1, lastWatered: '2025-07-03' },
    { id: 2, nextFertilize: '2025-07-10' },
  ]
  renderWith(plants, { forecast: { rainfall: 5 }, timezone: 'UTC' })
  expect(screen.getByTestId('count')).toHaveTextContent('1')
})

test('returns zero when nothing due', () => {
  const plants = [
    { id: 1, lastWatered: '2025-07-05' },
    { id: 2, nextFertilize: '2025-07-20' },
  ]
  renderWith(plants, { forecast: { rainfall: 0 }, timezone: 'UTC' })
  expect(screen.getByTestId('count')).toHaveTextContent('0')
})
