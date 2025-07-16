import React from 'react'
import { Drop, CalendarCheck, Flower } from 'phosphor-react'

export default function QuickStatsCard({ lastWatered, nextWater, lastFertilized }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex justify-between items-center text-sm">
        <span className="flex items-center gap-1 text-blue-600">
          <Drop className="w-4 h-4" aria-hidden="true" />
          Last watered:
        </span>
        <span className="text-gray-700">{lastWatered}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="flex items-center gap-1 text-green-600">
          <CalendarCheck className="w-4 h-4" aria-hidden="true" />
          Next watering:
        </span>
        <span className="text-gray-700">{nextWater}</span>
      </div>
      {lastFertilized && (
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1 text-yellow-600">
            <Flower className="w-4 h-4" aria-hidden="true" />
            Last fertilized:
          </span>
          <span className="text-gray-700">{lastFertilized}</span>
        </div>
      )}
    </div>
  )
}
