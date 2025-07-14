import React from 'react'

export default function SummaryStrip({ completed = 0, total = 0 }) {
  return (
    <div className="rounded-2xl shadow-sm bg-white p-3 text-center">
      <p
        className="text-sm font-semibold"
        data-testid="summary-progress"
      >
        {completed} of {total} plants watered today
      </p>
      <div className="h-2 bg-gray-200 rounded mt-2" data-testid="summary-progress-bar">
        <div
          className="h-full bg-green-500 rounded"
          data-testid="summary-progress-bar-inner"
          style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  )
}
