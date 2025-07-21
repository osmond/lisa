import React from 'react'
import { Sun, Drop, CloudRain, Leaf, PawPrint } from 'phosphor-react'

export default function MetadataStrip({ plant }) {
  if (!plant) return null

  const items = [
    plant.light && { key: 'light', label: plant.light, Icon: Sun },
    plant.humidity && { key: 'humidity', label: plant.humidity, Icon: CloudRain },
    {
      key: 'water',
      label: plant.waterPlan?.interval
        ? `Water every ${plant.waterPlan.interval}d`
        : 'No water schedule',
      Icon: Drop,
    },
    plant.difficulty && { key: 'difficulty', label: plant.difficulty, Icon: Leaf },
    plant.petSafe && { key: 'petSafe', label: 'Pet safe', Icon: PawPrint },
  ].filter(Boolean)

  return (
    <div className="flex flex-wrap gap-2 mt-1" data-testid="metadata-strip">
      {items.map(({ key, label, Icon }) => (
        <span key={key} className="metadata-badge">
          <Icon className="w-4 h-4" aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  )
}
