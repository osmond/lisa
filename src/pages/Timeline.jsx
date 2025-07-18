import { usePlants } from '../PlantContext.jsx'
import { useMemo, useState } from 'react'
import actionIcons from '../components/ActionIcons.jsx'
import { formatMonth, formatDate } from '../utils/date.js'
import { buildEvents, groupEventsByMonth } from '../utils/events.js'
import NoteModal from '../components/NoteModal.jsx'
import NoteFab from '../components/NoteFab.jsx'

export default function Timeline() {
  const { plants, timelineNotes = [], addTimelineNote = () => {} } = usePlants()
  const [showNoteModal, setShowNoteModal] = useState(false)

  const plantEvents = useMemo(
    () => buildEvents(plants, { includePlantName: true }),
    [plants]
  )

  const noteEvents = useMemo(
    () =>
      timelineNotes.map(n => ({
        date: n.date,
        label: 'Note',
        note: n.text,
        type: 'log',
      })),
    [timelineNotes]
  )

  const events = useMemo(
    () => [...plantEvents, ...noteEvents].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [plantEvents, noteEvents]
  )

  const groupedEvents = useMemo(
    () => groupEventsByMonth(events),
    [events]
  )



  const bulletColors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-500',
  }

  return (
    <div className="overflow-y-auto max-h-full p-4 text-gray-700 dark:text-gray-200">
      <div className="rounded-xl bg-white shadow-sm p-4 border border-gray-100">
        {groupedEvents.map(([monthKey, list]) => (
          <div key={monthKey} className="mt-6 first:mt-0">
            <h3 className="text-[0.7rem] uppercase tracking-wider text-gray-300 mb-2">
              {formatMonth(monthKey)}
            </h3>
            <ul className="ml-3 border-l-2 border-gray-200 space-y-6 pl-5">
              {list.map((e, i) => {
                const Icon = actionIcons[e.type]
                return (
                  <li key={`${e.date}-${e.label}-${i}`} className="relative text-sm">
                    {Icon && (
                      <div className={`absolute -left-5 top-[0.25rem] w-4 h-4 flex items-center justify-center rounded-full ${bulletColors[e.type]}`}>
                        <Icon className="w-3 h-3 text-white" aria-hidden="true" />
                      </div>
                    )}
                    <div className={`flex items-start ${e.note ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm' : ''}`}> 
                      <div>
                        <span className="font-medium">{formatDate(e.date)}</span> — {e.label}
                        {e.note && (
                          <div className="text-xs italic text-green-700 mt-1">{e.note}</div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        {showNoteModal && (
          <NoteModal
            label="Note"
            onSave={text => {
              if (text) addTimelineNote(text)
              setShowNoteModal(false)
            }}
            onCancel={() => setShowNoteModal(false)}
          />
        )}
      </div>
      <NoteFab onAddNote={() => setShowNoteModal(true)} />
    </div>
  )
}
