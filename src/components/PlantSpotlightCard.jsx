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
          <span className="px-2 py-0.5 text-xs rounded-full bg-warning-amber-light text-warning-amber-dark">
            {plant.light}
          </span>
        )}
        {plant.difficulty && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-soft-leaf text-[var(--km-accent)]">
            {plant.difficulty}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full px-4 py-2 bg-primary-green text-white"
          onClick={handleWater}
        >
          Water
        </Button>
        <Button
          className="w-full px-4 py-1 bg-accent text-white"
          onClick={handleAddNote}
        >
          Add Note
        </Button>
        <button
          type="button"
          onClick={handleSkip}
          className="self-start text-primary-green underline text-sm"
        >
          Skip
        </button>
      </div>
      {nextPlant && (
        <p className="text-sm text-gray-500">Next up: {nextPlant.name}</p>
      )}
    </article>
  )
}
