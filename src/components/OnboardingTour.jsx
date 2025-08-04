import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from './Card.jsx'

const steps = [
  {
    title: 'Today',
    text: 'See tasks due now and keep your plants happy.',
  },
  {
    title: 'All Plants',
    text: 'Browse every plant in your collection at a glance.',
  },
  {
    title: 'Timeline',
    text: 'Review your care history and past milestones.',
  },
  {
    title: 'Add your plant',
    text: 'Ready to personalize? Add your first plant now.',
  },
]

export default function OnboardingTour({ onClose }) {
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const next = () => setIndex(i => Math.min(i + 1, steps.length - 1))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="max-w-sm text-center space-y-4">
        <h2 className="text-lg font-bold">{step.title}</h2>
        <p>{step.text}</p>
        {index < steps.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Next
          </button>
        ) : (
          <Link
            to="/onboard"
            onClick={onClose}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Plant
          </Link>
        )}
        <button
          type="button"
          onClick={onClose}
          className="block mx-auto mt-2 text-sm text-gray-600"
        >
          Skip
        </button>
      </Card>
    </div>
  )
}
