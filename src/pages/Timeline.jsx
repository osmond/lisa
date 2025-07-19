import { usePlants } from '../PlantContext.jsx'
import { useMemo, useState } from 'react'
import { SortAscending, SortDescending } from 'phosphor-react'

import { motion } from 'framer-motion'

import actionIcons from '../components/ActionIcons.jsx'
import LogDetailsModal from '../components/LogDetailsModal.jsx'
import { formatMonth, formatDate } from '../utils/date.js'
import { buildEvents, groupEventsByMonth } from '../utils/events.js'
import NoteModal from '../components/NoteModal.jsx'
import NoteFab from '../components/NoteFab.jsx'
import SectionCard from '../components/SectionCard.jsx'

export default function Timeline() {
  const { plants, timelineNotes = [], addTimelineNote = () => {} } = usePlants()
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [latestFirst, setLatestFirst] = useState(true)

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

  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByMonth(events)
    if (latestFirst) {
      return grouped
        .map(([month, list]) => [month, [...list].reverse()])
        .reverse()
    }
    return grouped
  }, [events, latestFirst])

  const [selectedEvent, setSelectedEvent] = useState(null)



  const bulletColors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-500',
    advanced: 'bg-purple-500',
    noteText: 'bg-gray-400',
  }

  return (
    <div className="relative overflow-y-auto max-h-full max-w-md mx-auto space-y-8 py-4 px-4 text-gray-700 dark:text-gray-200">
      <SectionCard className="border border-gray-100">
        <div className="flex justify-end px-1">
          <button
            type="button"
            onClick={() => setLatestFirst(l => !l)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {latestFirst ? (
              <SortDescending className="w-4 h-4" aria-hidden="true" />
            ) : (
              <SortAscending className="w-4 h-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {latestFirst ? 'Show oldest first' : 'Show newest first'}
            </span>
          </button>
        </div>
        <div className="relative">
          {groupedEvents.map(([monthKey, list]) => (
            <div key={monthKey} className="mt-6 first:mt-0">
              <h3 className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-1 text-timestamp uppercase tracking-wider text-gray-500 mb-2">
                {formatMonth(monthKey)}
              </h3>
              <ul className="relative ml-3 space-y-6 pl-5 before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-gray-200">
                {list.map((e, i) => {
                  const Icon = actionIcons[e.type]
                  return (
                    <motion.li
                      key={`${e.date}-${e.label}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative text-sm"
                    >
                      {Icon && (
                        <div
                          className={`absolute -left-5 top-[0.25rem] w-4 h-4 flex items-center justify-center rounded-full ${bulletColors[e.type]} z-10`}
                        >
                          <Icon className="w-3 h-3 text-white" aria-hidden="true" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(e)}
                        className={`text-left w-full flex items-start ${e.note ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm' : ''}`}
                      >
                        <div>
                          <span className="font-medium">{formatDate(e.date)}</span> — {e.label}
                          {e.note && (
                            <div className="text-xs italic text-green-700 mt-1">{e.note}</div>
                          )}
                        </div>
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
      {selectedEvent && (
        <LogDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
      <NoteFab onAddNote={() => setShowNoteModal(true)} />
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
)
}
