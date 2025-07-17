import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants, addBase } from '../PlantContext.jsx'
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
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full"
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
    default:
      return state
  }
}

export default function Add() {
  const { addPlant } = usePlants()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [step, setStep] = useState(1)

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const handleSubmit = () => {
    if (!state.name) return
    const imagePath = addBase(state.image || '/demo-image-01.jpg')
    addPlant({
      name: state.name,
      image: imagePath,
      lastWatered: state.lastWatered,
      nextWater: state.nextWater,
      ...(state.room && { room: state.room }),
      ...(state.notes && { notes: state.notes }),
      ...(state.careLevel && { careLevel: state.careLevel }),
    })
    navigate('/myplants')
  }

  return (
    <>
      <StepIndicator step={step} />
      {step === 1 && (
        <NameStep name={state.name} dispatch={dispatch} onNext={next} />
      )}
      {step === 2 && (
        <ImageStep
          image={state.image}
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
