import { Link } from 'react-router-dom'

export default function Breadcrumb({ room, plant }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-2">
      <ol className="flex items-center gap-1">
        <li className="flex items-center">
          <Link to="/myplants" className="text-blue-600 hover:underline">
            All Plants
          </Link>
          {(room || plant) && (
            <span aria-hidden="true" className="mx-1">
              &gt;
            </span>
          )}
        </li>
        {room && (
          <li className="flex items-center">
            {plant ? (
              <Link
                to={`/room/${encodeURIComponent(room)}`}
                className="text-blue-600 hover:underline"
              >
                {room}
              </Link>
            ) : (
              <span>{room}</span>
            )}
            {plant && (
              <span aria-hidden="true" className="mx-1">
                &gt;
              </span>
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
