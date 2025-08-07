import { useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import useCarePlan from '../hooks/useCarePlan.js'
import Spinner from './Spinner.jsx'
import { PlantForm, plantSchema } from '../schemas/plant'

export interface AddPlantFormProps {
  mode: 'add' | 'edit'
  defaultValues?: Partial<PlantForm>
  onSubmit: (data: PlantForm) => void
  onNameChange?: (name: string) => void
  onChange?: (data: Partial<PlantForm>) => void
  /**
   * Optional label for the submit button. Defaults to
   * "Add Plant" or "Save Changes" based on the mode.
   */
  submitLabel?: string
  /**
   * When true, disables the internal submit button. Useful for
   * preventing duplicate submissions while generating a plan.
   */
  submitDisabled?: boolean
  rooms?: string[]
  taxa?: { id: number; commonName: string; species: string }[]
  /**
   * When true, pot diameter is required. Useful when generating
   * a care plan that depends on pot size.
   */
  requireDiameter?: boolean
  /** When true, shows the care-plan generation and preview section */
  showCarePlan?: boolean
}

export default function AddPlantForm({
  mode,
  defaultValues,
  onSubmit,
  onNameChange,
  onChange,
  submitLabel,
  submitDisabled,
  rooms: roomsProp,
  taxa,
  requireDiameter,
  showCarePlan,
}: AddPlantFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PlantForm>({
    resolver: zodResolver(plantSchema),
    defaultValues,
  })

  const { plan, loading, error, generate, history, revert, index } =
    useCarePlan()

  const name = useWatch({ control, name: 'name' })
  const waterPlanWatch = useWatch({ control, name: 'waterPlan' })
  const carePlanWatch = useWatch({ control, name: 'carePlan' })

  useEffect(() => {
    const subscription = watch(data => {
      onChange?.(data)
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  useEffect(() => {
    const handler = setTimeout(() => {
      onNameChange?.(name ?? '')
    }, 300)
    return () => clearTimeout(handler)
  }, [name, onNameChange])

  const waterInterval = useWatch({ control, name: 'waterPlan.interval' })

  useEffect(() => {
    if (waterInterval !== undefined) {
      setValue('carePlan.water', waterInterval)
    }
  }, [waterInterval, setValue])

  useEffect(() => {
    if (!plan) return
    if (plan.water !== undefined) setValue('waterPlan.interval', plan.water)
    if (plan.water_volume_ml !== undefined)
      setValue('waterPlan.volume_ml', plan.water_volume_ml)
    if (plan.water_volume_oz !== undefined)
      setValue('waterPlan.volume_oz', plan.water_volume_oz)
    if (plan.fertilize !== undefined)
      setValue('carePlan.fertilize', plan.fertilize)
    setValue('carePlan', {
      ...(getValues('carePlan') || {}),
      text: plan.text,
      water: plan.water,
      fertilize: plan.fertilize,
    })
  }, [plan, setValue, getValues])

  const rooms = roomsProp ?? []
  const lightOptions = ['Low', 'Medium', 'High']
  const soilOptions = [
    { value: 'potting mix', label: 'Potting Mix' },
    { value: 'cactus mix', label: 'Cactus Mix' },
    { value: 'orchid bark', label: 'Orchid Bark' },
  ]

  const handleGenerate = () => {
    const values = getValues()
    generate({
      name: values.name,
      diameter: values.diameter,
      soil: values.soil || 'potting mix',
      light: values.light || 'Medium',
      room: values.room || '',
      humidity: Number(values.humidity) || 50,
    })
  }

  const hasPlan =
    !!(plan || carePlanWatch?.text || waterPlanWatch?.interval !== undefined)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">
        {mode === 'add' ? 'Add Plant' : 'Edit Plant'}
      </h1>

      <section className="space-y-4">
        <h2 className="font-medium">Basic Info</h2>
        <div className="grid gap-1">
          <label
            htmlFor="name"
            className="font-medium after:content-['*'] after:text-red-600"
          >
            Name
          </label>
          <input id="name" {...register('name')} required className="border rounded p-2" />
          {errors.name && (
            <p role="alert" className="text-red-600 text-sm">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="grid gap-1">
          <label htmlFor="species" className="font-medium">Species</label>
          <input
            id="species"
            list="species-options"
            {...register('species')}
            className="border rounded p-2"
          />
          {taxa?.length ? (
            <datalist id="species-options">
              {taxa.map(t => (
                <option key={t.id} value={t.species}>
                  {t.commonName}
                </option>
              ))}
            </datalist>
          ) : null}
        </div>
        <div className="grid gap-1">
          <label htmlFor="imageUrl" className="font-medium">Image URL</label>
          <input id="imageUrl" {...register('imageUrl')} className="border rounded p-2" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Schedule</h2>
        <div className="grid gap-1">
          <label htmlFor="lastWatered" className="font-medium">Last Watered</label>
          <input id="lastWatered" type="date" {...register('lastWatered')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="nextWater" className="font-medium">Next Watering</label>
          <input id="nextWater" type="date" {...register('nextWater')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="lastFertilized" className="font-medium">Last Fertilized</label>
          <input id="lastFertilized" type="date" {...register('lastFertilized')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="nextFertilize" className="font-medium">Next Fertilizing</label>
          <input id="nextFertilize" type="date" {...register('nextFertilize')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="wateringFrequency" className="font-medium">Watering Frequency (days)</label>
          <input id="wateringFrequency" type="number" {...register('wateringFrequency', { valueAsNumber: true })} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="fertilizingFrequency" className="font-medium">Fertilizing Frequency (days)</label>
          <input id="fertilizingFrequency" type="number" {...register('fertilizingFrequency', { valueAsNumber: true })} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="waterAmount" className="font-medium">Water Amount (mL)</label>
          <input id="waterAmount" type="number" {...register('waterAmount', { valueAsNumber: true })} className="border rounded p-2" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Care Plan</h2>
        <div className="grid gap-1">
          <label
            htmlFor="diameter"
            className={`font-medium ${
              requireDiameter ? "after:content-['*'] after:text-red-600" : ''
            }`}
          >
            Pot diameter (inches)
          </label>
          <input
            id="diameter"
            type="number"
            {...register('diameter')}
            required={requireDiameter}
            className="border rounded p-2"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="soil" className="font-medium">Soil type</label>
          <select id="soil" {...register('soil')} className="border rounded p-2">
            {soilOptions.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="light" className="font-medium">Light level</label>
          <select id="light" {...register('light')} className="border rounded p-2">
            {lightOptions.map(l => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="room" className="font-medium">Room</label>
          <select id="room" {...register('room')} className="border rounded p-2">
            <option value="">Select room</option>
            {rooms.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="humidity" className="font-medium">Humidity (%)</label>
          <input id="humidity" type="number" {...register('humidity')} className="border rounded p-2" />
        </div>
        {showCarePlan && (
          <>
            <div className="grid gap-1">
              <label htmlFor="waterInterval" className="font-medium">Water interval (days)</label>
              <input
                id="waterInterval"
                type="number"
                {...register('waterPlan.interval', { valueAsNumber: true })}
                className="border rounded p-2"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="waterVolumeMl" className="font-medium">Water amount (mL)</label>
              <input
                id="waterVolumeMl"
                type="number"
                {...register('waterPlan.volume_ml', { valueAsNumber: true })}
                className="border rounded p-2"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="waterVolumeOz" className="font-medium">Water amount (oz)</label>
              <input
                id="waterVolumeOz"
                type="number"
                {...register('waterPlan.volume_oz', { valueAsNumber: true })}
                className="border rounded p-2"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="fertilizeInterval" className="font-medium">Fertilize interval (days)</label>
              <input
                id="fertilizeInterval"
                type="number"
                {...register('carePlan.fertilize', { valueAsNumber: true })}
                className="border rounded p-2"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {hasPlan ? 'Regenerate AI Plan' : 'Generate Care Plan'}
            </button>
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
                    <option key={i} value={i}>
                      v{i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {loading && <Spinner className="mt-2 text-green-600" />}
            {(plan || carePlanWatch) && (
              <div className="space-y-2" data-testid="care-plan">
                {(plan?.text || carePlanWatch?.text) && (
                  <pre className="whitespace-pre-wrap p-4 bg-green-50 rounded">
                    {(plan?.text || carePlanWatch?.text) as string}
                  </pre>
                )}
                {waterPlanWatch?.interval !== undefined && (
                  <p className="font-medium">
                    Suggested water: {waterPlanWatch?.volume_ml} mL / {waterPlanWatch?.volume_oz} oz every
                    {waterPlanWatch?.interval} days
                  </p>
                )}
              </div>
            )}
            {error && (
              <p role="alert" className="text-red-600">
                {error}
              </p>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Advanced</h2>
        <div className="grid gap-1">
          <label htmlFor="notes" className="font-medium">Notes</label>
          <textarea id="notes" rows={3} {...register('notes')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="careLevel" className="font-medium">Care Level</label>
          <input id="careLevel" {...register('careLevel')} className="border rounded p-2" />
        </div>
      </section>

      <button
        type="submit"
        disabled={submitDisabled}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {submitLabel ?? (mode === 'add' ? 'Add Plant' : 'Save Changes')}
      </button>
    </form>
  )
}
