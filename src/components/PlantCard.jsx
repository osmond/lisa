import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import useRipple from '../utils/useRipple.js'
import { usePlants } from '../PlantContext.jsx'
import NoteModal from './NoteModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const { markWatered, removePlant } = usePlants()
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [, createRipple] = useRipple()

  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleWatered()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      navigate(`/plant/${plant.id}/edit`)
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      handleDelete()
    }
  }

  const handleWatered = () => {
    setShowNote(true)
  }

  const handleDelete = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    removePlant(plant.id)
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  const handleSaveNote = note => {
    markWatered(plant.id, note)
    setShowNote(false)
  }

  const handleCancelNote = () => {
    handleSaveNote('')
  }

  const handlePointerDown = e => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
  }

  const handlePointerMove = e => {
    if (!startX.current) return
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setDeltaX(currentX - startX.current)
  }

  const handlePointerEnd = e => {
    const currentX = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? startX.current
    const diff = deltaX || (currentX - startX.current)
    setDeltaX(0)
    startX.current = 0
    if (diff > 75) {
      handleWatered()
    } else if (diff < -150) {
      handleDelete()
    } else if (diff < -75) {
      navigate(`/plant/${plant.id}/edit`)
    }
  }

  return (
    <>
    <div
      data-testid="card-wrapper"
      tabIndex="0"
      aria-label={`Plant card for ${plant.name}`}
      onKeyDown={handleKeyDown}
      onMouseDown={e => { createRipple(e); handlePointerDown(e) }}
      onTouchStart={e => { createRipple(e); handlePointerDown(e) }}
      className="relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}
      onClick={() => setShowActions(true)}
    >
      <div
        className={`absolute inset-0 flex justify-between items-center px-4 transition
        pointer-events-none opacity-0
        group-hover:opacity-100 group-hover:pointer-events-auto group-hover:animate-fade-in-up
        group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:animate-fade-in-up
        ${showActions ? 'opacity-100 pointer-events-auto animate-fade-in-up' : ''}`}
      >
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={handleWatered}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden"
        >
          Water
        </button>
        <div className="flex gap-2">
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={() => navigate(`/plant/${plant.id}/edit`)}
            className="bg-blue-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden font-body text-sm"
          >
            Edit
          </button>
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={handleDelete}
            className="bg-red-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden font-body text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <div
        className="p-4 border dark:border-gray-600 rounded-2xl shadow-sm bg-white dark:bg-gray-700"
        style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
      >
        <Link to={`/plant/${plant.id}`} className="block mb-2">
          <img src={plant.image} alt={plant.name} loading="lazy" className="w-full h-48 object-cover rounded-xl" />
          <h2 className="font-bold text-xl font-headline mt-2">{plant.name}</h2>
        </Link>
        <p className="text-sm text-green-700 font-medium font-body">Next: {plant.nextWater}</p>
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={handleWatered}
          className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition relative overflow-hidden font-body text-sm"
        >
          Watered
        </button>
      </div>
    </div>
    {showNote && (
      <NoteModal label="Optional note" onSave={handleSaveNote} onCancel={handleCancelNote} />
    )}
    {showConfirm && (
      <ConfirmModal
        label="Delete this plant?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    )}
    </>
  )
}
