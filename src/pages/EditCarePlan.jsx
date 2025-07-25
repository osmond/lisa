import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/PageContainer.jsx'
import Spinner from '../components/Spinner.jsx'
import { usePlants } from '../PlantContext.jsx'
import useCarePlan from '../hooks/useCarePlan.js'

export default function EditCarePlan() {
  const { id } = useParams()
  const { plants, updatePlant } = usePlants()
  const navigate = useNavigate()

  const plant = plants.find(p => p.id === Number(id))
  const [waterInterval, setWaterInterval] = useState(plant?.waterPlan?.interval || '')
  const [waterVolumeMl, setWaterVolumeMl] = useState(plant?.waterPlan?.volume_ml || '')
  const [waterVolumeOz, setWaterVolumeOz] = useState(plant?.waterPlan?.volume_oz || '')
  const [fertilizeInterval, setFertilizeInterval] = useState(plant?.carePlan?.fertilize || '')
  const { plan, loading, generate, history, revert, index } = useCarePlan()

  useEffect(() => {
    if (!plan) return
    if (plan.water !== undefined) setWaterInterval(plan.water)
    if (plan.water_volume_ml !== undefined) setWaterVolumeMl(plan.water_volume_ml)
    if (plan.water_volume_oz !== undefined) setWaterVolumeOz(plan.water_volume_oz)
    if (plan.fertilize !== undefined) setFertilizeInterval(plan.fertilize)
  }, [plan])

  if (!plant) {
    return <div className="text-gray-700">Plant not found</div>
  }

  const handleSubmit = e => {
    e.preventDefault()
    updatePlant(plant.id, {
      waterPlan: {
        interval: Number(waterInterval) || 0,
        volume_ml: Number(waterVolumeMl) || 0,
        volume_oz: Number(waterVolumeOz) || 0,
      },
      carePlan: { ...(plant.carePlan || {}), water: Number(waterInterval) || 0, fertilize: Number(fertilizeInterval) || 0 },
    })
    navigate(`/plant/${plant.id}`)
  }

  const handleGenerate = () => {
    generate({
      name: plant.name,
      diameter: plant.diameter,
      soil: plant.soil || 'potting mix',
      light: plant.light || 'Medium',
      room: plant.room || '',
      humidity: Number(plant.humidity) || 50,
    })
  }

  return (
    <PageContainer size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-heading font-bold font-headline">Edit Care Plan</h1>
        <div className="grid gap-1">
          <label htmlFor="waterInterval" className="font-medium">Water interval (days)</label>
          <input
            id="waterInterval"
            type="number"
            value={waterInterval}
            onChange={e => setWaterInterval(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="waterVolumeMl" className="font-medium">Water amount (mL)</label>
          <input
            id="waterVolumeMl"
            type="number"
            value={waterVolumeMl}
            onChange={e => setWaterVolumeMl(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="waterVolumeOz" className="font-medium">Water amount (oz)</label>
          <input
            id="waterVolumeOz"
            type="number"
            value={waterVolumeOz}
            onChange={e => setWaterVolumeOz(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="fertilizeInterval" className="font-medium">Fertilize interval (days)</label>
          <input
            id="fertilizeInterval"
            type="number"
            value={fertilizeInterval}
            onChange={e => setFertilizeInterval(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            Generate Care Plan
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
        {history.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="plan-version" className="font-medium">Version</label>
            <select
              id="plan-version"
              value={index}
              onChange={e => revert(Number(e.target.value))}
              className="border rounded p-1"
            >
              {history.map((_, i) => (
                <option key={i} value={i}>v{i + 1}</option>
              ))}
            </select>
          </div>
        )}
        {loading && <Spinner className="mt-2 text-green-600" />}
      </form>
    </PageContainer>
  )
}
