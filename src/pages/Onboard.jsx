import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants } from '../PlantContext.jsx'
import { useRooms } from '../RoomContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import PageContainer from "../components/PageContainer.jsx"
import Spinner from '../components/Spinner.jsx'
import useCarePlan from '../hooks/useCarePlan.js'
import usePlantTaxon from '../hooks/usePlantTaxon.js'

export default function Onboard() {
  const { addPlant } = usePlants()
  const { rooms } = useRooms()
  const navigate = useNavigate()
  const { forecast } = useWeather() || {}
  const [form, setForm] = useState({
    name: '',
    scientificName: '',
    diameter: '',
    soil: 'potting mix',
    light: 'Medium',
    room: '',
    humidity: '',
  })
  const [water, setWater] = useState(null)
  const { plan, loading, error, generate, history, revert, index } = useCarePlan()
  const [carePlan, setCarePlan] = useState(null)
  const taxa = usePlantTaxon(form.name)

  useEffect(() => {
    if (plan?.text) {
      try {
        const parsed = JSON.parse(plan.text)
        if (parsed && typeof parsed === 'object') setCarePlan(parsed)
        else setCarePlan(null)
      } catch {
        setCarePlan(null)
      }
    } else if (plan) {
      setCarePlan(plan)
    } else {
      setCarePlan(null)
    }

    if (
      plan?.water !== undefined &&
      plan?.water_volume_ml !== undefined &&
      plan?.water_volume_oz !== undefined
    ) {
      setWater({
        interval: plan.water,
        volume_ml: plan.water_volume_ml,
        volume_oz: plan.water_volume_oz,
      })
    } else {
      setWater(null)
    }
  }, [plan])

  const handleUseOutdoorHumidity = () => {
    if (forecast?.humidity !== undefined) {
      setForm(f => ({ ...f, humidity: forecast.humidity }))
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleNameChange = async e => {
    const value = e.target.value
    const match = taxa.find(
      t => t.commonName.toLowerCase() === value.toLowerCase()
    )
    setForm(f => ({
      ...f,
      name: value,
      scientificName: match ? match.scientificName : f.scientificName,
    }))

    if (!value || !form.diameter || typeof fetch !== 'function') return

    try {
      const res = await fetch('/api/care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value, diameter: form.diameter }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'error')

      setForm(f => ({
        ...f,
        ...(data.light && { light: data.light }),
        ...(data.humidity !== undefined && { humidity: data.humidity }),
      }))

      if (
        data.water !== undefined &&
        data.water_volume_ml !== undefined &&
        data.water_volume_oz !== undefined
      ) {
        setWater({
          interval: data.water,
          volume_ml: data.water_volume_ml,
          volume_oz: data.water_volume_oz,
        })
      }
    } catch (err) {
      console.error('care plan error', err)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    generate(form)
  }

  const handleAdd = () => {
    addPlant({
      name: form.name,
      ...(form.scientificName && { scientificName: form.scientificName }),
      room: form.room,
      diameter: Number(form.diameter) || 0,
      light: form.light,
      waterPlan: water,
      notes: plan?.text || '',
      carePlan,
    })
    navigate('/')
  }

  return (
    <PageContainer size="md">
      <h1 className="text-heading font-bold font-headline mb-4">Guided Onboarding</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-1">
          <label htmlFor="name" className="font-medium" title="Enter the common or scientific name">Plant name</label>
          <input id="name" name="name" type="text" list="plant-name-list" value={form.name} onChange={handleNameChange} className="border rounded p-2" required />
          <datalist id="plant-name-list">
            {taxa.map(t => (
              <option key={t.id} value={t.commonName}>{t.scientificName}</option>
            ))}
          </datalist>
        </div>
        <div className="grid gap-1">
          <label htmlFor="diameter" className="font-medium" title="Size across the top of the pot">Pot diameter (inches)</label>
          <input id="diameter" name="diameter" type="number" value={form.diameter} onChange={handleChange} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="soil" className="font-medium" title="Choose the soil mix">Soil type</label>
          <select id="soil" name="soil" value={form.soil} onChange={handleChange} className="border rounded p-2">
            <option value="potting mix">Potting mix</option>
            <option value="cactus mix">Cactus mix</option>
            <option value="orchid mix">Orchid mix</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="light" className="font-medium" title="Lighting at the plant's location">Light level</label>
          <select id="light" name="light" value={form.light} onChange={handleChange} className="border rounded p-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Bright Indirect">Bright Indirect</option>
            <option value="Bright Direct">Bright Direct</option>
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="room" className="font-medium" title="Where the plant lives">Room</label>
          <input id="room" name="room" list="room-list" value={form.room} onChange={handleChange} className="border rounded p-2" />
          <datalist id="room-list">
            {rooms.map(r => <option key={r} value={r} />)}
          </datalist>
        </div>
        <div className="grid gap-1">
          <label htmlFor="humidity" className="font-medium" title="Average humidity in the room">Humidity (%)</label>
          <div className="flex gap-2">
            <input id="humidity" name="humidity" type="number" value={form.humidity} onChange={handleChange} className="border rounded p-2 flex-grow" />
            {forecast?.humidity !== undefined && (
              <button type="button" onClick={handleUseOutdoorHumidity} className="px-2 text-sm underline whitespace-nowrap">Use outdoor</button>
            )}
          </div>
        </div>
        
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>Generate Care Plan</button>
      </form>

      {loading && <Spinner className="mt-4 text-green-600" />}
      {error && <p role="alert" className="text-red-600 mt-4">{error}</p>}
      {history.length > 1 && (
        <div className="mt-4 flex items-center gap-2">
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
      {plan && water ? (
        <div className="mt-6 space-y-4" data-testid="care-plan">
          <pre className="whitespace-pre-wrap p-4 bg-green-50 rounded">{plan.text}</pre>
          <p className="font-medium" data-testid="water-plan">
            Suggested water: {water.volume_ml} mL / {water.volume_oz} oz every {water.interval} days
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleAdd}>Add Plant</button>
        </div>
      ) : (
        !loading && (
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400" data-testid="care-plan-pending">
            Not yet configured.
          </p>
        )
      )}
    </PageContainer>
  )
}
