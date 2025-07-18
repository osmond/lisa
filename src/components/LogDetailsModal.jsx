import actionIcons from './ActionIcons.jsx'
import { formatDate } from '../utils/date.js'

export default function LogDetailsModal({ event, onClose }) {
  if (!event) return null
  const Icon = actionIcons[event.type]
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Log details"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 w-72 max-w-full">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
          <h3 className="font-headline text-heading">{event.label}</h3>
        </div>
        <p className="text-sm mb-2">{formatDate(event.date)}</p>
        {event.note && (
          <p className="italic text-green-700 text-sm mb-2">{event.note}</p>
        )}
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
