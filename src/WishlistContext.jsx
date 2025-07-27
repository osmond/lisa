import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {}
      }
    }
    return []
  })

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist])

  const addToWishlist = plant => {
    setWishlist(prev => {
      if (prev.find(p => p.id === plant.id)) return prev
      return [...prev, plant]
    })
  }

  const removeFromWishlist = id => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
