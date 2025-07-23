import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants, addBase } from '../PlantContext.jsx'
import usePlaceholderPhoto from '../hooks/usePlaceholderPhoto.js'
import useToast from '../hooks/useToast.jsx'
import NameStep from './add/NameStep.jsx'
import ImageStep from './add/ImageStep.jsx'
import ScheduleStep from './add/ScheduleStep.jsx'
import OptionalInfoStep from './add/OptionalInfoStep.jsx'

const totalSteps = 4

function StepIndicator({ step }) {
  const width = (step / totalSteps) * 100
  return (
    <div className="max-w-md mx-auto mb-4" data-testid="step-indicator">
      <p className="text-sm font-medium text-center mb-2">
        Step {step} of {totalSteps}
      </p>
      <div
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin="0"
        aria-valuemax={totalSteps}
      >
        <div
          className="bg-green-600 h-2 rounded-full transition-[width] duration-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

const initialState = {
  name: '',
  image: '',
  lastWatered: '',
  nextWater: '',
  lastFertilized: '',
  nextFertilize: '',
  room: '',
  notes: '',
  careLevel: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload }
    case 'SET_IMAGE':
      return { ...state, image: action.payload }
    case 'SET_LAST':
      return { ...state, lastWatered: action.payload }
    case 'SET_NEXT':
      return { ...state, nextWater: action.payload }
    case 'SET_LAST_FERT':
      return { ...state, lastFertilized: action.payload }
    case 'SET_NEXT_FERT':
      return { ...state, nextFertilize: action.payload }
    case 'SET_ROOM':
      return { ...state, room: action.payload }
    case 'SET_NOTES':
      return { ...state, notes: action.payload }
    case 'SET_CARE':
      return { ...state, careLevel: action.payload }
    default:
      return state
  }
}

export default function Add() {
  const { addPlant } = usePlants()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(1)
  const placeholder = usePlaceholderPhoto(state.name)
  const { Toast, showToast } = useToast()

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const handleSubmit = () => {
    if (!state.name) return
    const imagePath = addBase(state.image || placeholder?.src || '')
    addPlant({
      name: state.name,
      image: imagePath,
      lastWatered: state.lastWatered,
      nextWater: state.nextWater,
      lastFertilized: state.lastFertilized,
      nextFertilize: state.nextFertilize,
      ...(state.room && { room: state.room }),
      ...(state.notes && { notes: state.notes }),
      ...(state.careLevel && { careLevel: state.careLevel }),
      diameter: 0,
      waterPlan: { volume: 0, interval: 0 },
    })
    showToast('Added')
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <>
      <Toast />
      <StepIndicator step={step} />
      {step === 1 && (
        <NameStep name={state.name} dispatch={dispatch} onNext={next} />
      )}
      {step === 2 && (
        <ImageStep
          image={state.image}
          placeholder={placeholder?.src}
          dispatch={dispatch}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 3 && (
        <ScheduleStep
          lastWatered={state.lastWatered}
          nextWater={state.nextWater}
          lastFertilized={state.lastFertilized}
          nextFertilize={state.nextFertilize}
          dispatch={dispatch}
          onBack={back}
          onSubmit={next}
        />
      )}
      {step === 4 && (
        <OptionalInfoStep
          room={state.room}
          notes={state.notes}
          careLevel={state.careLevel}
          dispatch={dispatch}
          onBack={back}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}
