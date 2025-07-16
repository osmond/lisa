import { Drop, Flower, Note } from 'phosphor-react'

export default function LegendModal({ onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Legend"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 w-72 max-w-full">
        <h3 className="font-headline mb-2">Legend</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Drop className="w-4 h-4 text-blue-600" aria-hidden="true" /> Watered
          </li>
          <li className="flex items-center gap-2">
            <Flower className="w-4 h-4 text-yellow-600" aria-hidden="true" /> Fertilized
          </li>
          <li className="flex items-center gap-2">
            <Note className="w-4 h-4 text-gray-500" aria-hidden="true" /> Note
          </li>
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
