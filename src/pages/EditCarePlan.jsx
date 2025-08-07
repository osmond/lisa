import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer.jsx'
import { usePlants } from '../PlantContext.jsx'
import AddPlantForm from '../components/AddPlantForm.tsx'

export default function EditCarePlan() {
  const { id } = useParams()
  const { plants, updatePlant } = usePlants()
  const navigate = useNavigate()

  const plant = plants.find(p => p.id === Number(id))
  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const handleSubmit = data => {
    updatePlant(plant.id, data)
    navigate(`/plant/${plant.id}`)
  }

  return (
    <PageContainer size="md">
      <AddPlantForm
        mode="edit"
        showCarePlan
        defaultValues={plant}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  )
}
