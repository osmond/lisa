import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOpenAI } from '../OpenAIContext.jsx'
import { usePlants } from '../PlantContext.jsx'
import { useRooms } from '../RoomContext.jsx'
import { useWeather } from '../WeatherContext.jsx'
import PageContainer from '../components/PageContainer.jsx'
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
  const taxa = usePlantTaxon(form.name)

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
    setForm(f => ({ ...f, name }))
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
      }
    } catch (err) {
      console.error('care plan error', err)
    }
  }

  const handleAdd = data => {
    addPlant(data)
    navigate('/')
  }

  return (
    <PageContainer size="md">
      <h1 className="text-heading font-bold font-headline mb-4">Guided Onboarding</h1>
      <AddPlantForm
        mode="add"
        showCarePlan
        defaultValues={form}
        onChange={setForm}
        onNameChange={handleNameChange}
        onSubmit={handleAdd}
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
    </PageContainer>
  )
}
