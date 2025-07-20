import React, { useState } from 'react'

export default function CareCard({ label, Icon, progress = 0, status, onDone }) {
  const [completed, setCompleted] = useState(false)
  const pct = Math.min(Math.max(progress, 0), 1)
  const width = `${pct * 100}%`
  const handleDone = () => {
    if (!onDone) return
    setCompleted(true)
    setTimeout(() => {
      onDone()
      setCompleted(false)
    }, 200)
  }
  return (
    <div className={`bg-white dark:bg-gray-700 rounded-2xl shadow p-4 space-y-2 ${completed ? 'swipe-left-out' : ''}`} data-testid="care-card">
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
      <div className="h-2 rounded bg-gray-200 overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct*100)} aria-valuemin="0" aria-valuemax="100">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-orange-500 to-red-500"
          style={{ width }}
        ></div>
      </div>
    </div>
  )
}
