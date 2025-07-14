export default function PhotoMenu({ onShare, onEdit, onCover, onClose }) {
  return (
    <div
      role="menu"
      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-2 text-white rounded"
    >
      {navigator.share && (
        <button onClick={onShare} className="px-2 py-1 bg-white/20 rounded">
          Share
        </button>
      )}
      <button onClick={onEdit} className="px-2 py-1 bg-white/20 rounded">
        Edit Note
      </button>
      <button onClick={onCover} className="px-2 py-1 bg-white/20 rounded">
        Set as Cover
      </button>
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-1 right-1 text-xl"
      >
        &times;
      </button>
    </div>
  )
}
