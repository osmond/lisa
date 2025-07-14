import { useEffect, useRef, useState } from 'react'

import Button from "./Button.jsx"
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
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <Button
        ref={closeBtnRef}
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl"
      >
        &times;
      </Button>
      <Button
        aria-label="Previous image"
        className="absolute left-4 text-white text-3xl"
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
      >
        ‹
      </Button>
      <img
        src={images[index]}
        alt="Gallery image"
        className="max-w-full max-h-full object-contain"
      />
      <Button
        aria-label="Next image"
        className="absolute right-4 text-white text-3xl"
        onClick={() => setIndex((index + 1) % images.length)}
      >
        ›
      </Button>
    </div>
  )
}
