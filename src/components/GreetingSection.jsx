import React from 'react'
import { useUser } from '../UserContext.jsx'

export default function GreetingSection({ allHappy = false }) {
  const { username, timeZone } = useUser()
  const now = new Date()
  const hour = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    hour12: false,
    timeZone,
  })
  const h = parseInt(hour, 10)
  const timeOfDay = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  const emoji = h < 12 ? '\uD83C\uDF24' : h < 18 ? '\u2600\uFE0F' : '\uD83C\uDF19'

  return (
    <section className="mb-4 space-y-1" data-testid="greeting-section">
      <h2 className="font-headline text-xl font-semibold">
        {`Good ${timeOfDay}, ${username} ${emoji}`}
      </h2>
      {allHappy && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          All your plants are thriving today!
        </p>
      )}
    </section>
  )
}
