import { useMemo } from 'react'
import FadeInImage from '../components/FadeInImage.jsx'
import photos from '../photoMetadata.json'
import { formatMonth } from '../utils/date.js'

export default function PhotoTimeline() {
  const grouped = useMemo(() => {
    const sorted = [...photos].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )
    const map = new Map()
    sorted.forEach(p => {
      const key = p.date.slice(0, 7)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(p)
    })
    return Array.from(map.entries())
  }, [])

  return (
    <div className="p-4 space-y-4 text-gray-700 dark:text-gray-200 overflow-y-auto max-h-full">
      {grouped.map(([monthKey, list]) => (
        <div key={monthKey}>
          <h3 className="mt-4 text-label font-semibold text-gray-500">
            {formatMonth(monthKey)}
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {list.map((photo, i) => (
              <li key={i} className="flex flex-col items-start">
                <div className="relative group w-full" tabIndex="0">
                  <FadeInImage
                    src={photo.src}
                    alt={`Photo from ${photo.date}`}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity"
                  >
                    {photo.date}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
