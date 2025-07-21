import React, { useState } from 'react'
import Sprout from './icons/Sprout.jsx'

export default function CareCard({
  label,
  Icon,
  progress = 0,
  status,
  onDone,
  completed = false,
}) {
  const [internalCompleted, setInternalCompleted] = useState(false)
  const pct = Math.min(Math.max(progress, 0), 1)
  const width = `${pct * 100}%`
  const handleDone = () => {
    if (!onDone) return
    setInternalCompleted(true)
    setTimeout(() => {
      onDone()
      setInternalCompleted(false)
    }, 200)
  }
  const showComplete = internalCompleted || completed
  return (
    <div
      className={`relative bg-white dark:bg-gray-700 rounded-2xl shadow p-4 space-y-2 ${internalCompleted ? 'swipe-left-out' : ''}`}
      data-testid="care-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
          <span className="font-semibold">{label}</span>
        </div>
        {onDone && (
          <button
            type="button"
            onClick={handleDone}
            className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded shadow px-3 py-1 transition"
          >
            Mark as Done
          </button>
        )}
      </div>
      {status && <p className="text-sm text-gray-500">{status}</p>}
      <div
        className="h-2 rounded bg-gray-200 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct * 100)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="h-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500"
          style={{ width }}
        ></div>
      </div>
      {showComplete && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none task-complete-fade">
          {label === 'Fertilize' ? (
            <Sprout className="w-8 h-8 text-healthy-600 sprout-bounce swipe-check fade-in" />
          ) : (
            <svg
              className="w-8 h-8 text-healthy-600 check-pop swipe-check fade-in"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}
