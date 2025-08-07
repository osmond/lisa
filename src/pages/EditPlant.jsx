import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer.jsx'
import { usePlants } from '../PlantContext.jsx'
import { useRooms } from '../RoomContext.jsx'
import AddPlantForm from '../components/AddPlantForm.tsx'

export default function EditPlant() {
  const { id } = useParams()
  const { plants, updatePlant } = usePlants()
  const { rooms } = useRooms()
  const navigate = useNavigate()

  const plant = plants.find(p => p.id === Number(id))
  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const handleSubmit = data => {
    updatePlant(plant.id, {
      ...data,
      diameter: Number(data.diameter) || 0,
      ...(data.humidity && { humidity: Number(data.humidity) }),
    })
    navigate(`/plant/${plant.id}`)
  }

  return (
    <PageContainer size="md">
      <AddPlantForm mode="edit" defaultValues={plant} onSubmit={handleSubmit} rooms={rooms} />
    </PageContainer>
  )
}
