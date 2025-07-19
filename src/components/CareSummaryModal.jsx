import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'

export default function CareSummaryModal({ tasks = [], onClose }) {
  const { logEvent } = usePlants()
  const navigate = useNavigate()

  const handleAddNote = () => {
    const note = window.prompt('Note') || ''
    if (note && tasks[0]) {
      logEvent(tasks[0].plantId, 'Note', note)
    }
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Care summary"
      className="modal-overlay bg-black bg-opacity-70 z-50"
    >
      <div className="modal-box relative p-4 w-72 max-w-full">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        <h2 className="text-heading font-semibold font-headline mb-2">Care Summary</h2>
        {tasks.length > 0 ? (
          <ul className="list-disc pl-4 mb-4 text-left">
            {tasks.map(t => (
              <li key={t.id}>{t.type} {t.plantName}</li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-center font-body text-sm">No care tasks today!</p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleAddNote}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            + Add Note
          </button>
          <button
            onClick={() => { navigate('/timeline'); onClose() }}
            className="px-3 py-1 bg-sage text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-sm"
          >
            View Timeline
          </button>
        </div>
      </div>
    </div>
  )
}
