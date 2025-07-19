import React from 'react'
import { Link } from 'react-router-dom'
import PageContainer from "../components/PageContainer.jsx"
import { addBase } from '../PlantContext.jsx'

export default function Gallery() {
  return (
    <PageContainer className="text-center space-y-4">
      <h2 className="text-heading font-headline">Gallery</h2>
      <img
        src={addBase('/happy-plant.svg')}
        alt="Empty gallery"
        className="w-32 h-32 mx-auto"
      />
      <p className="text-gray-700 dark:text-gray-200">
        Gallery will unlock once you add photos.
      </p>
      <Link
        to="/add"
        className="inline-block px-4 py-2 bg-green-600 text-white rounded"
      >
        Add a plant
      </Link>
    </PageContainer>
  )
}
