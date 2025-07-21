import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function DetailTabs({ tabs = [], value, onChange, className = '' }) {
  const [internal, setInternal] = useState(value ?? tabs[0]?.id)
  const active = value ?? internal

  const containerRef = useRef(null)
  const tabRefs = useRef({})
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const node = tabRefs.current[active]
    if (node && containerRef.current) {
      const { offsetLeft, offsetWidth } = node
      setUnderline({ left: offsetLeft, width: offsetWidth })
    }
  }, [active, tabs])

  const handleClick = id => {
    onChange?.(id)
    if (value === undefined) {
      setInternal(id)
    }
  }

  const activeTab = tabs.find(t => t.id === active)

  return (
    <div className={`bg-white dark:bg-gray-700 rounded-xl shadow ${className}`.trim()}>
      <div className="relative">
        <div
          role="tablist"
          ref={containerRef}
          className="flex justify-center gap-2 px-4 pt-4"
        >
          {tabs.map(tab => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                ref={el => (tabRefs.current[tab.id] = el)}
                aria-selected={isActive}
                onClick={() => handleClick(tab.id)}
                className={`relative px-3 py-1 focus:outline-none ${
                  isActive ? 'text-green-600 font-semibold' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
          <motion.div
            className="tab-underline"
            style={{ left: underline.left, width: underline.width }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>
      <div className="p-4 animate-fade-in-up">{activeTab?.content}</div>
    </div>
  )
}
