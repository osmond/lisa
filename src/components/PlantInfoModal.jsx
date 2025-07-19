import { Sun, Drop, Gauge } from 'phosphor-react'

export default function PlantInfoModal({ plant, onClose }) {
  if (!plant) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Plant info"
      className="modal-overlay bg-black/70 z-50"
    >
      <div className="modal-box p-4 w-72 max-w-full">
        <h3 className="font-headline mb-2">{plant.name} Info</h3>
        <ul className="space-y-2 text-sm">
          {plant.light && (
            <li className="flex items-center gap-2">
              <Sun className="w-4 h-4" aria-hidden="true" /> {plant.light}
            </li>
          )}
          {plant.humidity && (
            <li className="flex items-center gap-2">
              <Drop className="w-4 h-4" aria-hidden="true" /> {plant.humidity}
            </li>
          )}
          {plant.difficulty && (
            <li className="flex items-center gap-2">
              <Gauge className="w-4 h-4" aria-hidden="true" /> {plant.difficulty}
            </li>
          )}
        </ul>
        <div className="flex justify-end mt-4">
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
