import { usePlants } from '../PlantContext.jsx'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SortAscending, SortDescending } from 'phosphor-react'

import { motion } from 'framer-motion'

import actionIcons from '../components/ActionIcons.jsx'
import LogDetailsModal from '../components/LogDetailsModal.jsx'
import { formatMonth, formatDate } from '../utils/date.js'
import { buildEvents, groupEventsByMonth } from '../utils/events.js'
import NoteModal from '../components/NoteModal.jsx'
import NoteFab from '../components/NoteFab.jsx'
import SectionCard from '../components/SectionCard.jsx'
import useTimelineSummary from '../hooks/useTimelineSummary.js'

export default function Timeline() {
  const { plants, timelineNotes = [], addTimelineNote = () => {} } = usePlants()
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [latestFirst, setLatestFirst] = useState(true)
  const [filter, setFilter] = useState('all')

  const plantEvents = useMemo(
    () => buildEvents(plants, { includePlantName: true, includePlantId: true }),
    [plants]
  )

  const noteEvents = useMemo(
    () =>
      timelineNotes.map(n => ({
        date: n.date,
        label: 'Note',
        note: n.text,
        type: 'log',
        tags: n.tags || [],
      })),
    [timelineNotes]
  )

  const events = useMemo(
    () => [...plantEvents, ...noteEvents].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [plantEvents, noteEvents]
  )

  const { summary, loading: summaryLoading, error: summaryError } = useTimelineSummary(events)

  const filteredEvents = useMemo(
    () =>
      events.filter(e => {
        if (filter === 'all') return true
        if (filter === 'water') return e.type === 'water'
        if (filter === 'fertilize') return e.type === 'fertilize'
        if (filter === 'notes') return e.note || e.type === 'note' || e.type === 'noteText'
        return true
      }),
    [events, filter]
  )

  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByMonth(filteredEvents)
    if (latestFirst) {
      return grouped
        .map(([month, list]) => [month, [...list].reverse()])
        .reverse()
    }
    return grouped
  }, [filteredEvents, latestFirst])

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [expandedMonths, setExpandedMonths] = useState(() => new Set())

  const toggleMonth = m =>
    setExpandedMonths(prev => {
      const next = new Set(prev)
      if (next.has(m)) next.delete(m)
      else next.add(m)
      return next
    })



  const bulletColors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-500',
    advanced: 'bg-purple-500',
    noteText: 'bg-gray-400',
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="relative overflow-y-auto max-h-full max-w-md mx-auto space-y-8 py-4 px-4 text-gray-700 dark:text-gray-200">
        <SectionCard className="border border-gray-100 text-center py-20">
          <p className="mb-4">Nothing here yet! Your plant’s journey begins with the first care log.</p>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="mx-auto bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow hover:bg-green-700"
          >
            +
            <span className="sr-only">Add first entry</span>
          </button>
        </SectionCard>
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

  return (
    <div className="relative overflow-y-auto max-h-full max-w-md mx-auto space-y-8 py-4 px-4 text-gray-700 dark:text-gray-200">
      {(summaryLoading || summary || summaryError) && (
        <SectionCard className="border border-gray-100 text-sm">
          {summaryLoading && <p>Loading summary…</p>}
          {summary && <p>{summary}</p>}
          {summaryError && (
            <p role="alert" className="text-red-600">{summaryError}</p>
          )}
        </SectionCard>
      )}
      <SectionCard className="border border-gray-100">
        <div className="flex items-center justify-between px-1 gap-2">
          <label htmlFor="timeline-filter" className="flex items-center gap-1 text-sm">
            Filter:
            <select
              id="timeline-filter"
              className="dropdown-select shadow-lg border border-gray-200 text-sm bg-white dark:bg-gray-800"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
            <option value="all">All</option>
            <option value="water">Watering</option>
            <option value="fertilize">Fertilizing</option>
            <option value="notes">Notes</option>
            </select>
          </label>
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
            <div key={monthKey} className="mt-6 first:mt-0 space-y-3">
              <h3 className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-1 text-timestamp uppercase tracking-wider text-gray-300 mb-2">
                {formatMonth(monthKey)}
              </h3>
              <ul className="relative ml-3 space-y-8 pl-5 before:absolute before:inset-y-0 before:left-2 before:border-l before:border-dashed before:border-gray-300 dark:before:border-gray-600">
                {(expandedMonths.has(monthKey) ? list : list.slice(0,7)).map((e, i) => {
                  const Icon = actionIcons[e.type]
                  return (
                    <motion.li
                      layout
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
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedEvent(e)}
                        onKeyDown={ev => {
                          if (ev.key === 'Enter' || ev.key === ' ') setSelectedEvent(e)
                        }}
                        className={`cursor-pointer text-left w-full flex items-start ${e.note ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-sm' : ''}`}
                      >
                        <div>
                          <span className="text-gray-500">{formatDate(e.date)}</span>
                          <span className="font-medium">
                            — {e.plantId && e.plantName && e.label.includes(e.plantName) ? (
                              (() => {
                                const idx = e.label.indexOf(e.plantName)
                                const before = e.label.slice(0, idx)
                                const after = e.label.slice(idx + e.plantName.length)
                                return (
                                  <>
                                    {before}
                                    <Link
                                      to={`/plant/${e.plantId}`}
                                      state={{ from: '/timeline' }}
                                      className="underline text-green-700 dark:text-green-300"
                                      onClick={ev => ev.stopPropagation()}
                                    >
                                      {e.plantName}
                                    </Link>
                                    {after}
                                  </>
                                )
                              })()
                            ) : (
                              e.label
                            )}
                          </span>
                          {e.note && (
                            <div className="text-xs italic text-green-700 mt-1">{e.note}</div>
                          )}
                          {e.tags && e.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {e.tags.map((t, idx) => (
                                <span key={idx} className="inline-flex bg-gray-200 text-gray-800 rounded px-2 py-0.5 text-[10px]">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  )
                })}
                {list.length > 7 && (
                  <li className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleMonth(monthKey)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      {expandedMonths.has(monthKey) ? 'Show less' : 'Show more…'}
                    </button>
                  </li>
                )}
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
