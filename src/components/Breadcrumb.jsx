import { Link } from 'react-router-dom'
import { CaretRight } from 'phosphor-react'

export default function Breadcrumb({ room, plant }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-2">
      <ol className="flex items-center gap-2">
        <li className="flex items-center">
          <Link to="/myplants" className="text-accent font-medium hover:underline">
            All Plants
          </Link>
          {(room || plant) && (
            <CaretRight className="w-3 h-3 mx-2 text-gray-400" aria-hidden="true" />
          )}
        </li>
        {room && (
          <li className="flex items-center">
            {plant ? (
              <Link
                to={`/room/${encodeURIComponent(room)}`}
                className="text-accent font-medium hover:underline"
              >
                {room}
              </Link>
            ) : (
              <span>{room}</span>
            )}
            {plant && (
              <CaretRight className="w-3 h-3 mx-2 text-gray-400" aria-hidden="true" />
            )}
          </li>
        )}
        {plant && (
          <li>
            <span>{plant}</span>
          </li>
        )}
      </ol>
    </nav>
  )
}
