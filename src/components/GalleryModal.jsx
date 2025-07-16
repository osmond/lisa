import { useEffect, useRef } from 'react'

export default function GalleryModal({ photos = [], onSelect, onClose, label = 'Gallery' }) {
  const closeRef = useRef(null)
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40"
    >
      <div className="relative bg-white dark:bg-gray-700 p-4 rounded-lg max-h-[90vh] overflow-y-auto">
        <button
          ref={closeRef}
          aria-label="Close"
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={i}
              onClick={() => onSelect?.(i)}
              className="focus:outline-none"
            >
              <img
                src={photo.src}
                alt={`${label} ${i}`}
                className="object-cover w-full aspect-square rounded"
              />
              {photo.caption && (
                <span className="block mt-1 text-xs text-center text-gray-700 dark:text-gray-200">
                  {photo.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
