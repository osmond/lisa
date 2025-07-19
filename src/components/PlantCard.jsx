import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Drop, PencilSimpleLine, Trash } from 'phosphor-react'
import Badge from './Badge.jsx'

import { createRipple } from '../utils/interactions.js'
import useSwipe from '../hooks/useSwipe.js'


import { usePlants } from '../PlantContext.jsx'
import useSnackbar from '../hooks/useSnackbar.jsx'
import NoteModal from './NoteModal.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import ImageCard from './ImageCard.jsx'
import { getWaterStatus } from '../utils/watering.js'

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const { plants, markWatered, removePlant, updatePlant, restorePlant } =
    usePlants()
  const { showSnackbar } = useSnackbar()
  const [showActions, setShowActions] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)

  const { thirsty, overdue } = getWaterStatus(plant.nextWater)
  const statusVariant = thirsty ? 'overdue' : 'complete'
  const statusLabel = thirsty ? 'Thirsty' : 'Healthy'

  const LONG_PRESS_MS = 600
  const EDIT_THRESHOLD = 100
  const DELETE_THRESHOLD = 200
  const COMPLETE_THRESHOLD = 100

  const longPressTimer = useRef(null)

  const handleKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleWatered()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      navigate(`/plant/${plant.id}/edit`)
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      setShowConfirm(true)
    }
  }

  function handleWatered() {
    setShowNote(true)
  }

  function handleDelete() {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    const index = plants.findIndex(p => p.id === plant.id)
    const snapshot = plants[index]
    removePlant(plant.id)
    showSnackbar('Plant removed', () => restorePlant(snapshot, index))
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  const handleSaveNote = note => {
    const prev = plants.find(p => p.id === plant.id)
    markWatered(plant.id, note)
    showSnackbar('Watered', () => updatePlant(plant.id, prev))
    setShowNote(false)
  }

  const handleCancelNote = () => {
    handleSaveNote('')
  }


  const { dx: deltaX, start, move, end } = useSwipe(diff => {
    if (diff > COMPLETE_THRESHOLD) {
      handleWatered()
      navigator.vibrate?.(10)
    } else if (diff < -DELETE_THRESHOLD) {
      setShowDeletePrompt(true)
      setShowConfirm(true)
    } else if (diff < -EDIT_THRESHOLD) {
      navigate(`/plant/${plant.id}/edit`)
      navigator.vibrate?.(10)
    }
  })




  const handlePointerDown = e => {
    createRipple(e)
    start(e)
    setShowDeletePrompt(false)
    longPressTimer.current = setTimeout(() => setShowActions(true), LONG_PRESS_MS)
  }

  const handlePointerMove = e => {
    move(e)
    if (Math.abs(deltaX) > 5 && longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePointerUp = e => {
    clearTimeout(longPressTimer.current)
    longPressTimer.current = null
    end(e)
  }

  return (
    <>
    <div
      data-testid="card-wrapper"
      tabIndex="0"
      aria-label={`Plant card for ${plant.name}`}
      onKeyDown={handleKeyDown}


      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className="relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}


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
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden flex items-center gap-1"
        >
          <Drop className="w-4 h-4" aria-hidden="true" />
          Water
        </button>
        <div className="flex gap-2">
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={() => navigate(`/plant/${plant.id}/edit`)}
            className="bg-blue-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden font-body text-sm flex items-center gap-1"
          >
            <PencilSimpleLine className="w-4 h-4" aria-hidden="true" />
            Edit
          </button>
          <button
            onMouseDown={createRipple}
            onTouchStart={createRipple}
            onClick={handleDelete}
            className="bg-red-600 text-white px-2 py-1 rounded pointer-events-auto relative overflow-hidden font-body text-sm flex items-center gap-1"
          >
            <Trash className="w-4 h-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
      {(deltaX < -40 || showDeletePrompt) && (
        <div className="absolute inset-0 flex justify-end items-center pr-4 pointer-events-none">
          {showDeletePrompt ? (
            <button
              onClick={() => {
                setShowDeletePrompt(false)
                handleDelete()
              }}
              className="bg-red-600 text-white px-3 py-1 rounded pointer-events-auto"
            >
              Delete?
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className={`bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-opacity ${deltaX < -40 ? 'opacity-100' : 'opacity-0'}`}
              >
                <PencilSimpleLine className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-body">Edit</span>
              </div>
              <div
                className={`bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 transition-opacity ${deltaX < -120 ? 'opacity-100' : 'opacity-0'}`}
              >
                <Trash className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-body">Delete</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="absolute top-2 right-2 pointer-events-none">
        <Badge variant={statusVariant} size="sm">
          {statusLabel}
        </Badge>
      </div>
      <ImageCard
        style={{ transform: `translateX(${deltaX}px)`, transition: deltaX === 0 ? 'transform 0.2s' : 'none' }}
        className={overdue ? 'ring-2 ring-yellow-300' : ''}
        imgSrc={plant.image}
        title={
          <Link
            to={
              plant.room
                ? `/room/${encodeURIComponent(plant.room)}/plant/${plant.id}`
                : `/plant/${plant.id}`
            }
            className="focus:outline-none"
          >
            {plant.name}
          </Link>
        }
      >
        <p className="text-sm text-green-700 font-medium font-body">Next: {plant.nextWater}</p>
        <button
          onMouseDown={createRipple}
          onTouchStart={createRipple}
          onClick={handleWatered}
          className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition relative overflow-hidden font-body text-sm flex items-center gap-1"
        >
          <Drop className="w-4 h-4" aria-hidden="true" />
          Watered
        </button>
      </ImageCard>
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
