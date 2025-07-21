import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TaskTabs({ value = 'Upcoming', onChange }) {
  const tabs = ['Upcoming', 'Past', 'By Plant', 'By Room']
  const containerRef = useRef(null)
  const tabRefs = useRef({})
  const [underline, setUnderline] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const node = tabRefs.current[value]
    if (node) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth })
    }
  }, [value])

  return (
    <div className="relative">
      <div role="tablist" ref={containerRef} className="flex justify-center gap-2 my-2">
        {tabs.map(tab => (
          <button
            key={tab}
            role="tab"
            ref={el => (tabRefs.current[tab] = el)}
            aria-selected={value === tab}
            onClick={() => onChange?.(tab)}
            className={`relative px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
              value === tab
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
        <motion.div
          className="tab-underline"
          style={{ left: underline.left, width: underline.width }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  )
}
