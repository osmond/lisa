import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
}

export default function AddPlantForm({
  mode,
  defaultValues,
  onSubmit,
  onNameChange,
  onChange,
  submitLabel,
  submitDisabled,
}: AddPlantFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PlantForm>({
    resolver: zodResolver(plantSchema),
    defaultValues,
  })

  useEffect(() => {
    const subscription = watch(data => {
      onChange?.(data)
      onNameChange?.(data.name ?? '')
    })
    return () => subscription.unsubscribe()
  }, [watch, onNameChange, onChange])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-heading font-bold font-headline">
        {mode === 'add' ? 'Add Plant' : 'Edit Plant'}
      </h1>

      <section className="space-y-4">
        <h2 className="font-medium">Basic Info</h2>
        <div className="grid gap-1">
          <label htmlFor="name" className="font-medium">Name</label>
          <input id="name" {...register('name')} className="border rounded p-2" />
          {errors.name && <p role="alert" className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>
        <div className="grid gap-1">
          <label htmlFor="species" className="font-medium">Species</label>
          <input id="species" {...register('species')} className="border rounded p-2" />
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
          <label htmlFor="diameter" className="font-medium">Pot diameter (inches)</label>
          <input id="diameter" type="number" {...register('diameter')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="soil" className="font-medium">Soil type</label>
          <input id="soil" {...register('soil')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="light" className="font-medium">Light level</label>
          <input id="light" {...register('light')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="room" className="font-medium">Room</label>
          <input id="room" {...register('room')} className="border rounded p-2" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="humidity" className="font-medium">Humidity (%)</label>
          <input id="humidity" type="number" {...register('humidity')} className="border rounded p-2" />
        </div>
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
