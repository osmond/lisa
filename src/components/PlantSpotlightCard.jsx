import { useState } from 'react'
import { usePlants } from '../PlantContext.jsx'

import Button from "./Button.jsx"
export default function PlantSpotlightCard({ plant, nextPlant, onSkip }) {
  const { markWatered, logEvent } = usePlants()
  const [ignored, setIgnored] = useState(false)

  if (!plant) return null

  const handleWater = () => {
    markWatered(plant.id, '')
  }

  const handleAddNote = () => {
    const note = window.prompt('Add note') || ''
    if (note) logEvent(plant.id, 'Note', note)
  }

  const handleSkip = () => {
    setIgnored(true)
    if (onSkip) onSkip()
  }

  if (ignored) return null

  return (
    <article className="rounded-xl bg-white shadow p-4 space-y-3">
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full rounded-lg object-cover"
        onError={e => (e.target.src = '/placeholder.svg')}
      />
      <h2 className="text-xl font-semibold leading-heading tracking-heading">{plant.name}</h2>
      <div className="flex gap-2">
        {plant.light && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
            {plant.light}
          </span>
        )}
        {plant.difficulty && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
            {plant.difficulty}
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <Button className="px-3 py-1 bg-accent text-white" onClick={handleWater}>
          Water
        </Button>
        <Button className="px-3 py-1 bg-accent text-white" onClick={handleAddNote}>
          Add Note
        </Button>
        <Button className="px-3 py-1" onClick={handleSkip}>
          Skip
        </Button>
      </div>
      {nextPlant && (
        <p className="text-sm text-gray-500">Next up: {nextPlant.name}</p>
      )}
    </article>
  )
}
