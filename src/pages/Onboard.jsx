import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOpenAI } from '../OpenAIContext.jsx'
import { usePlants } from '../PlantContext.jsx'
import { useRooms } from '../RoomContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import { generateCareSummary } from '../utils/careSummary.js'
import PageContainer from '../components/PageContainer.jsx'
import Spinner from '../components/Spinner.jsx'
import useCarePlan from '../hooks/useCarePlan.js'
import usePlantTaxon from '../hooks/usePlantTaxon.js'
import AddPlantForm from '../components/AddPlantForm.tsx'

export default function Onboard() {
  const { addPlant } = usePlants()
  const { rooms } = useRooms()
  const { enabled } = useOpenAI()
  const navigate = useNavigate()
  const { forecast } = useWeather() || {}
  const [form, setForm] = useState({
    name: '',
    species: '',
    diameter: '',
    soil: 'potting mix',
    light: 'Medium',
    room: '',
    humidity: '',
  })
  const [water, setWater] = useState(null)
  const [summary, setSummary] = useState(null)
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

  useEffect(() => {
    if (!form.name || !form.diameter || enabled) return
    const s = generateCareSummary(form.name, form.diameter, form.light, forecast || {})
    setSummary(s)
    if (!plan && !water) setWater(s.waterPlan)
  }, [form.name, form.diameter, form.light, forecast, plan, enabled])

  useEffect(() => {
    const match = taxa.find(t => t.commonName.toLowerCase() === form.name.toLowerCase())
    if (match) setForm(f => ({ ...f, species: match.species }))
  }, [taxa, form.name])

  const handleUseOutdoorHumidity = () => {
    if (forecast?.humidity !== undefined) {
      setForm(f => ({ ...f, humidity: forecast.humidity }))
    }
  }

  const handleNameChange = async name => {
    setForm(f => ({
      ...f,
      name,
    }))

    if (!name || !form.diameter) return

    try {
      const payload = { ...form, name }
      if (enabled && typeof fetch === 'function') {
        const res = await fetch('/api/care-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'error')

        setForm(f => ({
          ...f,
          ...(data.soil && { soil: data.soil }),
          ...(data.light && { light: data.light }),
          ...(data.room && { room: data.room }),
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
      } else {
        const summary = generateCareSummary(
          name,
          form.diameter,
          form.light,
          forecast || {}
        )
        setSummary(summary)
        setWater(summary.waterPlan)
      }
    } catch (err) {
      console.error('care plan error', err)
    }
  }

  const handleSubmit = () => {
    if (enabled) {
      generate(form)
    } else {
      const s = generateCareSummary(form.name, form.diameter, form.light, forecast || {})
      setSummary(s)
      setWater(s.waterPlan)
    }
  }

  const handleAdd = () => {
    addPlant({
      name: form.name,
      ...(form.species && { species: form.species }),
      room: form.room,
      diameter: Number(form.diameter) || 0,
      light: form.light,
      waterPlan: water,
      notes: plan?.text || '',
      carePlan: {
        ...(carePlan || {}),
        ...(summary ? { placement: summary.placement, repot: summary.repot } : {}),
      },
    })
    navigate('/')
  }

  return (
    <PageContainer size="md">
      <h1 className="text-heading font-bold font-headline mb-4">Guided Onboarding</h1>
      <AddPlantForm
        mode="add"
        defaultValues={form}
        onChange={setForm}
        onNameChange={handleNameChange}
        onSubmit={handleSubmit}
        submitLabel="Generate Plan"
        submitDisabled={loading}
        rooms={rooms}
        taxa={taxa}
        requireDiameter
      />
      <button
        type="button"
        onClick={handleUseOutdoorHumidity}
        disabled={forecast?.humidity === undefined}
        className="mt-2 text-sm text-green-600 underline disabled:text-gray-400"
      >
        Use outdoor humidity
      </button>
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
      {(plan || !enabled) && water ? (
        <div className="mt-6 space-y-4" data-testid="care-plan">
          <pre className="whitespace-pre-wrap p-4 bg-green-50 rounded">{plan.text}</pre>
          <p className="font-medium" data-testid="water-plan">
            Suggested water: {water.volume_ml} mL / {water.volume_oz} oz every {water.interval} days
          </p>
          {summary && (
            <ul className="text-sm space-y-1" data-testid="calc-summary">
              <li>Placement: {summary.placement}</li>
              <li>{summary.repot}</li>
            </ul>
          )}
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
