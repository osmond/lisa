import { Link } from 'react-router-dom'

export default function Breadcrumb({ room, plant }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm mb-2">
      <Link to="/myplants" className="text-blue-600 hover:underline">
        My Plants
      </Link>
      {room && (
        <>
          <span className="mx-1">&gt;</span>
          {plant ? (
            <Link to={`/room/${encodeURIComponent(room)}`} className="text-blue-600 hover:underline">
              {room}
            </Link>
          ) : (
            <span>{room}</span>
          )}
        </>
      )}
      {plant && (
        <>
          <span className="mx-1">&gt;</span>
          <span>{plant}</span>
        </>
      )}
    </nav>
  )
}
