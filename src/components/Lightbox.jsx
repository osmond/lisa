import { useEffect, useState } from 'react'

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex)

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
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button
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
      <img
        src={images[index]}
        alt="Gallery image"
        className="max-w-full max-h-full object-contain"
      />
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
