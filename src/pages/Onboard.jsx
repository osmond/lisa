import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import { useRooms } from '../RoomContext.jsx'
import PageContainer from "../components/PageContainer.jsx"
import useCarePlan from '../hooks/useCarePlan.js'
import { getWaterPlan } from '../utils/waterCalculator.js'

export default function Onboard() {
  const { addPlant } = usePlants()
  const { rooms } = useRooms()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    pot: 'M',
    diameter: '',
    soil: 'potting mix',
    light: 'Medium',
    room: '',
    humidity: '',
    experience: 'Beginner',
  })
  const [water, setWater] = useState(null)
  const { plan, loading, error, generate } = useCarePlan()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setWater(getWaterPlan(form.name, form.diameter))
    generate(form)
  }

  const handleAdd = () => {
    addPlant({
      name: form.name,
      room: form.room,
      diameter: Number(form.diameter) || 0,
      waterPlan: water,
      notes: plan?.text || '',
      diameter: form.diameter,
    })
    navigate('/')
  }

  return (
    <PageContainer size="md">
      <h1 className="text-heading font-bold font-headline mb-4">Guided Onboarding</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-1">
          <label htmlFor="name" className="font-medium">Plant type</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className="border rounded p-2" required />
        </div>
        <div className="grid gap-1">
          <label htmlFor="pot" className="font-medium">Pot size</label>
          <select id="pot" name="pot" value={form.pot} onChange={handleChange} className="border rounded p-2">
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="diameter" className="font-medium">Pot diameter (inches)</label>
          <input id="diameter" name="diameter" type="number" value={form.diameter} onChange={handleChange} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="soil" className="font-medium">Soil type</label>
          <select id="soil" name="soil" value={form.soil} onChange={handleChange} className="border rounded p-2">
            <option value="potting mix">Potting mix</option>
            <option value="cactus mix">Cactus mix</option>
            <option value="orchid mix">Orchid mix</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="light" className="font-medium">Light level</label>
          <select id="light" name="light" value={form.light} onChange={handleChange} className="border rounded p-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Bright Indirect">Bright Indirect</option>
            <option value="Bright Direct">Bright Direct</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="room" className="font-medium">Room</label>
          <input id="room" name="room" list="room-list" value={form.room} onChange={handleChange} className="border rounded p-2" />
          <datalist id="room-list">
            {rooms.map(r => <option key={r} value={r} />)}
          </datalist>
        </div>
        <div className="grid gap-1">
          <label htmlFor="humidity" className="font-medium">Humidity (%)</label>
          <input id="humidity" name="humidity" type="number" value={form.humidity} onChange={handleChange} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="experience" className="font-medium">Experience</label>
          <select id="experience" name="experience" value={form.experience} onChange={handleChange} className="border rounded p-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>Generate Care Plan</button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p role="alert" className="text-red-600 mt-4">{error}</p>}
      {plan && (
        <div className="mt-6 space-y-4" data-testid="care-plan">
          <pre className="whitespace-pre-wrap p-4 bg-green-50 rounded">{plan.text}</pre>
          {water && (
            <p className="font-medium" data-testid="water-plan">
              Suggested water: {water.volume} in³ every {water.interval} days
            </p>
          )}
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleAdd}>Add Plant</button>
        </div>
      )}
    </PageContainer>
  )
}
