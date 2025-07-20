import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants, addBase } from '../PlantContext.jsx'
import useINatPhoto from '../hooks/useINatPhoto.js'
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
  room: '',
  notes: '',
  careLevel: '',
  species: '',
  problems: [],
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
    case 'SET_ROOM':
      return { ...state, room: action.payload }
    case 'SET_NOTES':
      return { ...state, notes: action.payload }
    case 'SET_CARE':
      return { ...state, careLevel: action.payload }
    case 'SET_IDENTIFICATION':
      return {
        ...state,
        species: action.payload.species || '',
        problems: action.payload.problems || [],
      }
    default:
      return state
  }
}

export default function Add() {
  const { addPlant, addTimelineNote } = usePlants()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(1)
  const placeholder = useINatPhoto(state.name)
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
      ...(state.room && { room: state.room }),
      ...(state.notes && { notes: state.notes }),
      ...(state.careLevel && { careLevel: state.careLevel }),
      ...(state.species && { species: state.species }),
      ...(state.problems.length > 0 && { problems: state.problems }),
    })
    if (state.species) {
      const msg = `Identified as ${state.species}` +
        (state.problems.length ? `; Issues: ${state.problems.join(', ')}` : '')
      addTimelineNote(msg)
    }
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
          species={state.species}
          problems={state.problems}
          dispatch={dispatch}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 3 && (
        <ScheduleStep
          lastWatered={state.lastWatered}
          nextWater={state.nextWater}
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
