import { render, screen, fireEvent } from '@testing-library/react'
import { PlantProvider, usePlants } from '../PlantContext.jsx'

function TestComponent() {
  const { plants, markWatered } = usePlants()
  const plant = plants[0]
  return (
    <div>
      <button onClick={() => markWatered(plant.id, 'test note')}>log</button>
      <ul>
        {(plant.careLog || []).map((e, i) => (
          <li key={i}>{e.note}</li>
        ))}
      </ul>
    </div>
  )
}

function FertTestComponent() {
  const { plants, markFertilized } = usePlants()
  const plant = plants[0]
  return (
    <div>
      <button onClick={() => markFertilized(plant.id, 'fert note')}>log</button>
      <ul>
        {(plant.careLog || []).map((e, i) => (
          <li key={i}>{e.note}</li>
        ))}
      </ul>
    </div>
  )
}

test('markWatered stores notes in careLog', () => {
  render(
    <PlantProvider>
      <TestComponent />
    </PlantProvider>
  )

  fireEvent.click(screen.getByText('log'))
  expect(screen.getByText('test note')).toBeInTheDocument()
})

test('markFertilized stores notes in careLog', () => {
  render(
    <PlantProvider>
      <FertTestComponent />
    </PlantProvider>
  )

  fireEvent.click(screen.getByText('log'))
  expect(screen.getByText('fert note')).toBeInTheDocument()
})
