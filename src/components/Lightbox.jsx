import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ images, startIndex = 0, onClose, label = 'Image viewer' }) {
  const [index, setIndex] = useState(startIndex)
  const closeBtnRef = useRef(null)
  const prevFocusRef = useRef(null)

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        setIndex(i => (i + 1) % images.length)
      } else if (e.key === 'ArrowLeft') {
        setIndex(i => (i - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    prevFocusRef.current = document.activeElement
    closeBtnRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      prevFocusRef.current?.focus()
    }
  }, [images.length, onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="modal-overlay bg-black bg-opacity-80 z-50"
    >
      <button
        ref={closeBtnRef}
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl"
      >
        &times;
      </button>
      <button
        aria-label="Previous image"
        className="absolute top-1/2 -translate-y-1/2 left-4 text-white text-3xl p-2 rounded-full bg-black/40 opacity-70 hover:opacity-100"
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
      >
        ‹
      </button>
      {(() => {
        const current =
          typeof images[index] === 'string' ? { src: images[index] } : images[index]
        return (
          <div className="relative">
            <img
              src={current.src}
              alt={current.caption || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
            {(current.caption || current.date) && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-2 py-1 rounded text-sm">
                {current.caption}
                {current.date && ` \u2014 ${current.date}`}
              </p>
            )}
          </div>
        )
      })()}
      <button
        aria-label="Next image"
        className="absolute top-1/2 -translate-y-1/2 right-4 text-white text-3xl p-2 rounded-full bg-black/40 opacity-70 hover:opacity-100"
        onClick={() => setIndex((index + 1) % images.length)}
      >
        ›
      </button>
    </div>,
    document.body
  )
}
