import React from 'react'

import { formatDaysAgo } from '../utils/dateFormat.js'

export default function UnifiedTaskCard({ plant, urgent = false, overdue = false }) {
  if (!plant) return null
  const { name, image, dueWater, dueFertilize, lastCared } = plant
  const needs = []
  if (dueWater) needs.push('water \uD83D\uDCA7')
  if (dueFertilize) needs.push('fertilizer \u2600\uFE0F')
  const summary = needs.length ? `Needs ${needs.join(' and ')}` : 'No care needed'

  const bgClass = overdue
    ? 'bg-red-50 dark:bg-red-900'
    : urgent
    ? 'bg-yellow-50 dark:bg-yellow-900'
    : 'bg-gray-50 dark:bg-gray-800'

  const lastText = lastCared ? formatDaysAgo(lastCared) : null
  const last = lastText ? (
    <p className="text-xs text-gray-500">Last cared for {lastText}</p>
  ) : null

  return (
    <div
      data-testid="unified-task-card"
      className={`rounded-2xl border border-neutral-200 dark:border-gray-600 shadow-sm overflow-hidden ${bgClass}`}
    >
      <div className="flex items-center gap-4 p-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm bg-neutral-100 dark:bg-gray-700">
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold font-headline text-gray-900 dark:text-gray-100 truncate">
            {name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
          {last}
        </div>
        <div className="flex flex-col gap-1 items-end">
          {dueWater && (
            <button
              type="button"
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-xs flex items-center gap-1"
            >
              Water Now
            </button>
          )}
          {dueFertilize && (
            <button
              type="button"
              className="px-3 py-1 border border-yellow-600 text-yellow-600 rounded-full text-xs flex items-center gap-1"
            >
              Fertilize Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
