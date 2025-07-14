import { useRef, useState } from 'react'
import { Drop } from 'phosphor-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import actionIcons from './ActionIcons.jsx'
import useRipple from '../utils/useRipple.js'
import { relativeDate } from '../utils/relativeDate.js'
import { useWeather } from '../WeatherContext.jsx'
import Button from "./Button.jsx"

import NoteModal from './NoteModal.jsx'

import TaskActions from './TaskActions.jsx'
import TaskModal from './TaskModal.jsx'


export default function TaskCard({ task, onComplete }) {
  const { markWatered, updatePlant } = usePlants()
  const navigate = useNavigate()
  const Icon = actionIcons[task.type]
  const [checked, setChecked] = useState(false)

  const [showNoteModal, setShowNoteModal] = useState(false)


  const [showActions, setShowActions] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const startX = useRef(0)
  const [deltaX, setDeltaX] = useState(0)

  const [bouncing, setBouncing] = useState(false)


  const [, createRipple] = useRipple()
  const { timezone } = useWeather() || {}
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date(
    new Date().toLocaleString('en-US', { timeZone: tz })
  )

  const daysDiff = task.date
    ? Math.round((new Date(task.date) - now) / (1000 * 60 * 60 * 24))
    : 0
  const overdue = task.date && daysDiff < 0
  const dueColor = task.date
    ? daysDiff < 0
      ? 'text-amber-600'
      : daysDiff <= 2
      ? 'text-orange-600'
      : 'text-green-600'
    : ''

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task)
    } else if (task.type === 'Water') {

      if (typeof document !== 'undefined') {
        setShowNoteModal(true)
      } else if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
        const note = window.prompt('Optional note') || ''
        markWatered(task.plantId, note)
      } else {
        markWatered(task.plantId, '')
      }

        return

    }
    setChecked(true)
    setBouncing(true)
    setTimeout(() => {
      setChecked(false)
      setBouncing(false)
    }, 400)
  }

  const handleNoteSave = note => {
    markWatered(task.plantId, note)
    setShowNoteModal(false)
    setShowModal(true)
  }

  const pillColors = {
    Water: 'bg-blue-100 text-blue-700',
    Fertilize: 'bg-orange-100 text-orange-700',
    Overdue: 'bg-amber-100 text-amber-700',
  }
  const pillClass = overdue
    ? pillColors.Overdue
    : pillColors[task.type] || 'bg-green-100 text-green-700'

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
    const diff = deltaX || currentX - startX.current
    setDeltaX(0)
    startX.current = 0
    if (Math.abs(diff) > 75) {
      setShowActions(true)
    }
  }

  const handleWater = () => {
    setShowActions(false)
    setShowModal(true)
  }

  const handleSkip = () => {
    handleComplete()
    setShowActions(false)
  }

  const handleSnooze = () => {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    updatePlant(task.plantId, { nextWater: tomorrow.toISOString().slice(0, 10) })
    setShowActions(false)
  }

  const handleView = () => {
    navigate(`/plant/${task.plantId}`)
  }

  const handleSaveModal = ({ note }) => {
    markWatered(task.plantId, note)
  }

  return (
    <div
      data-testid="task-wrapper"
      className={`relative flex items-center gap-3 p-5 rounded-2xl shadow-sm bg-white dark:bg-gray-800 overflow-hidden ${overdue ? 'border-l-4 border-amber-500 shadow-amber-200' : ''}`}
      onMouseDown={e => { createRipple(e); handlePointerDown(e) }}
      onTouchStart={e => { createRipple(e); handlePointerDown(e) }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerEnd}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerEnd}
      tabIndex="0"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleComplete()
        }
      }}
    >
      <Link to={`/plant/${task.plantId}`} className="flex items-center flex-1 gap-3">
        <img
          src={task.image}
          alt={task.plantName}
          className={`w-16 h-16 object-cover rounded ${bouncing ? 'bounce-once' : ''}`}
          onError={e => (e.target.src = '/placeholder.svg')}
        />
        <div className="flex-1">
          <p className="font-medium">{task.type} {task.plantName}</p>
          {task.date && (
            <p className={`text-xs ${dueColor}`}>{relativeDate(task.date, now, tz)}</p>
          )}
          {task.reason && (
            <p className="text-xs text-gray-500">{task.reason}</p>
          )}
        </div>
        {Icon && <Icon />}
      </Link>
      <Button
        onMouseDown={createRipple}
        onTouchStart={createRipple}
        onClick={handleComplete}
        className={`ml-2 px-3 py-1 relative overflow-hidden ${pillClass}`}
        aria-label="Mark complete"
      >
        <input type="checkbox" checked={checked} readOnly className="task-checkbox" />

      </Button>

      {checked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Drop aria-hidden="true" className="w-8 h-8 text-blue-600 water-drop" />
        </div>
      )}

      {showNoteModal && (
        <NoteModal
          onSave={handleNoteSave}
          onClose={() => setShowNoteModal(false)}
        />
      )}

      <TaskActions
        visible={showActions}
        onWater={handleWater}
        onSkip={handleSkip}
        onSnooze={handleSnooze}
        onView={handleView}
      />

      {showModal && (
        <TaskModal
          onSave={handleSaveModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
