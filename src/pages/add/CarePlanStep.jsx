import { useState, useEffect } from 'react'
import PageContainer from "../../components/PageContainer.jsx"
import Spinner from '../../components/Spinner.jsx'
import { useRooms } from '../../RoomContext.jsx'
import { useWeather } from '../../WeatherContext.jsx'
import useCarePlan from '../../hooks/useCarePlan.js'

export default function CarePlanStep({ name, state, dispatch, onBack, onNext }) {
  const { rooms } = useRooms()
  const { forecast } = useWeather() || {}
  const [form, setForm] = useState({
    diameter: state.diameter,
    soil: state.soil || 'potting mix',
    light: state.light || 'Medium',
    room: state.room,
    humidity: state.humidity,
  })
  const { plan, loading, error, generate, history, revert, index } = useCarePlan()
  const [water, setWater] = useState(state.waterPlan)

  useEffect(() => {
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
    }
  }, [plan])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleUseOutdoorHumidity = () => {
    if (forecast?.humidity !== undefined) {
      setForm(f => ({ ...f, humidity: forecast.humidity }))
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    generate({ name, ...form })
  }

  const handleNext = () => {
    dispatch({ type: 'SET_DIAMETER', payload: form.diameter })
    dispatch({ type: 'SET_SOIL', payload: form.soil })
    dispatch({ type: 'SET_LIGHT', payload: form.light })
    dispatch({ type: 'SET_ROOM', payload: form.room })
    dispatch({ type: 'SET_HUMIDITY', payload: form.humidity })
    if (plan) dispatch({ type: 'SET_CARE_PLAN', payload: plan })
    if (water) dispatch({ type: 'SET_WATER_PLAN', payload: water })
    onNext()
  }

  return (
    <PageContainer size="md">
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">Add Plant</h1>
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
        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
          <button type="button" onClick={handleNext} className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
        </div>
      </div>
    ) : (
      !loading && (
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 rounded">Back</button>
          <button type="button" onClick={onNext} className="px-4 py-2 bg-green-600 text-white rounded">Skip</button>
        </div>
      )
    )}
    </PageContainer>
  )
}
