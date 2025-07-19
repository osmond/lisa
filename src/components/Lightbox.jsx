import { useEffect, useRef, useState } from 'react'

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

  return (
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
        className="absolute left-4 text-white text-3xl"
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
      >
        ‹
      </button>
      {(() => {
        const current =
          typeof images[index] === 'string' ? { src: images[index] } : images[index]
        return (
          <>
            <img
              src={current.src}
              alt={current.caption || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
            {current.caption && (
              // <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-2 py-1 rounded text-sm">
              //   {current.caption}
              // </p>
              null
            )}
          </>
        )
      })()}
      <button
        aria-label="Next image"
        className="absolute right-4 text-white text-3xl"
        onClick={() => setIndex((index + 1) % images.length)}
      >
        ›
      </button>
    </div>
  )
}
