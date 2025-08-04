import React, { useState, useMemo } from 'react'
import PageContainer from '../components/PageContainer.jsx'
import CorrelationRippleMatrix from '../components/CorrelationRippleMatrix.tsx'
import { Question } from 'phosphor-react'

// Sample data for correlations. In a real app this would come from an API.
const labels = ['Water', 'Light', 'Humidity', 'Growth']
const matrix: number[][] = [
  [1, 0.8, 0.2, 0.6],
  [0.8, 1, 0.1, 0.4],
  [0.2, 0.1, 1, 0.3],
  [0.6, 0.4, 0.3, 1],
]

export default function Statistics() {
  const [showHelp, setShowHelp] = useState(false)

  const topPairs = useMemo(() => {
    const pairs: { a: string; b: string; value: number }[] = []
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix.length; j++) {
        pairs.push({ a: labels[i], b: labels[j], value: matrix[i][j] })
      }
    }
    pairs.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    return pairs.slice(0, 5)
  }, [])

  return (
    <PageContainer>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium">Statistics</h1>
        <button
          aria-label="How to read this"
          onClick={() => setShowHelp(s => !s)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Question className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      {showHelp && (
        <p className="text-sm text-gray-600">
          Each cell shows how closely two metrics move together. Values near 1 mean a
          strong relationship.
        </p>
      )}
      <div className="hidden md:block overflow-x-auto">
        <CorrelationRippleMatrix labels={labels} matrix={matrix} />
      </div>
      <div className="md:hidden divide-y divide-gray-200">
        {topPairs.map(p => (
          <div
            key={`${p.a}-${p.b}`}
            className="py-2 flex items-center gap-2"
          >
            <div className="flex-1 text-sm">
              {p.a} vs {p.b}
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-emerald-500 rounded"
                style={{ width: `${Math.abs(p.value) * 100}%` }}
              />
            </div>
            <div className="w-10 text-right text-xs">
              {p.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

