import React, { useState, useRef } from 'react'
import { Activity, Note, Clock } from 'phosphor-react'
import actionIcons from './ActionIcons.jsx'
import { formatMonth, formatDate } from '../utils/date.js'

export default function ActivityTabs({ plant, events = [], groupedEvents = [] }) {
  const tabNames = ['activity', 'notes', 'care', 'timeline']
  const tabRefs = useRef([])
  const [activeTab, setActiveTab] = useState('timeline')
  const [showMore, setShowMore] = useState(false)

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (index + dir + tabNames.length) % tabNames.length
      setActiveTab(tabNames[nextIndex])
      tabRefs.current[nextIndex]?.focus()
    }
  }

  const iconColors = {
    water: 'text-blue-500',
    fertilize: 'text-yellow-500',
    note: 'text-gray-400',
    log: 'text-green-500',
  }

  const bulletColors = {
    water: 'bg-blue-500',
    fertilize: 'bg-yellow-500',
    note: 'bg-gray-400',
    log: 'bg-green-500',
  }

  return (
    <div className="space-y-2 mt-4">
      <div role="tablist" className="flex gap-2">
        <button
          ref={el => (tabRefs.current[0] = el)}
          role="tab"
          id="activity-tab"
          aria-controls="activity-panel"
          aria-selected={activeTab === 'activity'}
          onClick={() => setActiveTab('activity')}
          onKeyDown={e => handleKeyDown(e, 0)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
            activeTab === 'activity'
              ? 'bg-green-600 text-white after:scale-x-100'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
          }`}
        >
          <Activity className="w-4 h-4 mr-1 inline" aria-hidden="true" />
          Activity
        </button>
        <button
          ref={el => (tabRefs.current[1] = el)}
          role="tab"
          id="notes-tab"
          aria-controls="notes-panel"
          aria-selected={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
          onKeyDown={e => handleKeyDown(e, 1)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
            activeTab === 'notes'
              ? 'bg-green-600 text-white after:scale-x-100'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
          }`}
        >
          <Note className="w-4 h-4 mr-1 inline" aria-hidden="true" />
          Notes
        </button>
        <button
          ref={el => (tabRefs.current[2] = el)}
          role="tab"
          id="care-tab"
          aria-controls="care-panel"
          aria-selected={activeTab === 'care'}
          onClick={() => setActiveTab('care')}
          onKeyDown={e => handleKeyDown(e, 2)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
            activeTab === 'care'
              ? 'bg-green-600 text-white after:scale-x-100'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
          }`}
        >
          Advanced
        </button>
        <button
          ref={el => (tabRefs.current[3] = el)}
          role="tab"
          id="timeline-tab"
          aria-controls="timeline-panel"
          aria-selected={activeTab === 'timeline'}
          onClick={() => setActiveTab('timeline')}
          onKeyDown={e => handleKeyDown(e, 3)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium focus:outline-none after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-white after:transition-transform after:duration-300 ${
            activeTab === 'timeline'
              ? 'bg-green-600 text-white after:scale-x-100'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 after:scale-x-0'
          }`}
        >
          <Clock className="w-4 h-4 mr-1 inline" aria-hidden="true" />
          Timeline
        </button>
      </div>
      <div
        role="tabpanel"
        id="activity-panel"
        aria-labelledby="activity-tab"
        hidden={activeTab !== 'activity'}
        className="p-4 border rounded-xl"
      >
        <ul className="list-disc pl-4 space-y-1">
          {(plant.careLog || []).map((ev, i) => (
            <li key={i}>
              {ev.type} on {ev.date}
              {ev.note ? ` - ${ev.note}` : ''}
            </li>
          ))}
        </ul>
      </div>
      <div
        role="tabpanel"
        id="notes-panel"
        aria-labelledby="notes-tab"
        hidden={activeTab !== 'notes'}
        className="p-4 border rounded-xl"
      >
        {plant.notes
          ? showMore
            ? plant.notes
            : plant.notes.slice(0, 160)
          : 'No notes yet.'}
        {plant.notes && plant.notes.length > 160 && (
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="ml-2 text-green-600 underline"
          >
            {showMore ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      <div
        role="tabpanel"
        id="care-panel"
        aria-labelledby="care-tab"
        hidden={activeTab !== 'care'}
        className="p-4 border rounded-xl"
      >
        {plant.advancedCare || 'No advanced care info.'}
      </div>
      <div
        role="tabpanel"
        id="timeline-panel"
        aria-labelledby="timeline-tab"
        hidden={activeTab !== 'timeline'}
        className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm"
      >
        {groupedEvents.map(([monthKey, list]) => (
          <div key={monthKey} className="mt-6 first:mt-0">
            <div className="text-sm font-semibold text-gray-500">
              {formatMonth(monthKey)}
            </div>
            <div className="ml-3 border-l-2 border-gray-200 space-y-4 mt-2 pl-5">
              {list.map((e, i) => {
                const Icon = actionIcons[e.type]
                return (
                  <div key={`${e.date}-${i}`} className="relative text-sm">
                    <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full ${bulletColors[e.type]}`}></div>
                    <p className="flex items-start gap-2 text-gray-700 ml-1">
                      {Icon && (
                        <Icon className={`w-4 h-4 ${iconColors[e.type]}`} aria-hidden="true" />
                      )}
                      <span>
                        <span className="font-medium">{formatDate(e.date)}</span> — {e.label}
                        {e.note && <>: <em>{e.note}</em></>}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
