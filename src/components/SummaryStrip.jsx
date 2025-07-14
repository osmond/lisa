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
    </div>
  )
}
