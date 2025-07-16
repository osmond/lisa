import React from 'react'
import { Sun, Drop, Gauge } from 'phosphor-react'
import Badge from './Badge.jsx'

export default function CareProfileCard({ light, humidity, difficulty }) {
  return (
    <div className="space-y-1 mt-4">
      <h3 className="text-base font-semibold font-headline">Care Profile</h3>
      {light && (
        <>
          <h4 className="text-xs font-semibold text-gray-500 mb-1">Light Needs</h4>
          <div className="flex gap-2 mb-3">
            <Badge Icon={Sun} colorClass="bg-yellow-50 text-yellow-800 text-xs">
              {light}
            </Badge>
          </div>
        </>
      )}
      <h4 className="text-xs font-semibold text-gray-500 mb-1 mt-1">Care Tags</h4>
      <div className="flex flex-wrap gap-2">
        {humidity && (
          <Badge Icon={Drop} colorClass="bg-blue-50 text-blue-800 text-xs">
            {humidity}
          </Badge>
        )}
        {difficulty && (
          <Badge Icon={Gauge} colorClass="bg-green-50 text-green-800 text-xs">
            {difficulty}
          </Badge>
        )}
      </div>
    </div>
  )
}
