import React from 'react'

import { Drop, Sun } from 'phosphor-react'
import { formatDaysAgo } from '../utils/dateFormat.js'
import Badge from './Badge.jsx'

export default function UnifiedTaskCard({ plant, urgent = false, overdue = false }) {
  if (!plant) return null
  const { name, image, dueWater, dueFertilize, lastCared } = plant

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
          <div className="flex items-center gap-2 mt-1">
            {dueWater && (
              <Badge Icon={Drop} colorClass="bg-water-100/90 text-water-800">
                Water
              </Badge>
            )}
            {dueFertilize && (
              <Badge
                Icon={Sun}
                colorClass="bg-fertilize-100/90 text-fertilize-800"
              >
                Fertilize
              </Badge>
            )}
            {!dueWater && !dueFertilize && (
              <Badge colorClass="bg-healthy-100/90 text-healthy-800">
                No care needed
              </Badge>
            )}
          </div>
          {last}
        </div>
      </div>
    </div>
  )
}
