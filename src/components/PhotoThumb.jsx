import { useState } from 'react'
import useLongPress from '../utils/useLongPress.js'
import PhotoMenu from './PhotoMenu.jsx'

export default function PhotoThumb({ src, alt, onRemove, onShare, onEdit, onCover, onClick }) {
  const [showMenu, setShowMenu] = useState(false)
  const handlers = useLongPress(() => setShowMenu(true))

  return (
    <div
      className="relative"
      {...handlers}
      onClick={e => {
        if (!showMenu) onClick?.(e)
      }}
    >
      <img src={src} alt={alt} className="object-cover w-full h-24 rounded" />
      {onRemove && (
        <button
          className="absolute top-1 right-1 bg-white bg-opacity-70 rounded px-1 text-xs"
          onClick={onRemove}
        >
          ✕
        </button>
      )}
      {showMenu && (
        <PhotoMenu
          onShare={() => { setShowMenu(false); onShare?.() }}
          onEdit={() => { setShowMenu(false); onEdit?.() }}
          onCover={() => { setShowMenu(false); onCover?.() }}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}
