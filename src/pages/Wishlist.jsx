import { Link } from 'react-router-dom'
import BalconyPlantCard from '../components/BalconyPlantCard.jsx'
import PageContainer from '../components/PageContainer.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { createRipple } from '../utils/interactions.js'
import { useWishlist } from '../WishlistContext.jsx'
import useSnackbar from '../hooks/useSnackbar.jsx'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { showSnackbar } = useSnackbar()

  const handleRemove = plant => {
    removeFromWishlist(plant.id)
    showSnackbar(`${plant.name} removed`, null)
  }

  if (wishlist.length === 0) {
    return (
      <PageContainer>
        <PageHeader title="Wishlist" />
        <p>No plants in wishlist.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Wishlist" />
      <div className="space-y-8 pb-24">
        {wishlist.map(plant => (
          <div key={plant.id} className="relative">
            <Link
              to={plant.room ? `/room/${encodeURIComponent(plant.room)}/plant/${plant.id}` : `/plant/${plant.id}`}
              state={{ from: '/wishlist' }}
              className="block"
              onMouseDown={createRipple}
              onTouchStart={createRipple}
            >
              <BalconyPlantCard plant={plant} />
            </Link>
            <button
              type="button"
              onClick={() => handleRemove(plant)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
