import React from 'react'

export default function CarePlanInfoModal({ onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Care plan information"
      className="modal-overlay bg-black/70 z-50"
    >
      <div className="modal-box p-4 w-72 max-w-full">
        <h3 className="font-headline mb-2">How We Create Your Care Plan</h3>
        <p className="text-sm mb-4">
          Suggested watering amounts use your plant name, pot size and light level
          along with weather data to fine tune the schedule.
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
