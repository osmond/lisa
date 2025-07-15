import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants, addBase } from '../PlantContext.jsx'
import NameStep from './add/NameStep.jsx'
import ImageStep from './add/ImageStep.jsx'
import ScheduleStep from './add/ScheduleStep.jsx'

const initialState = {
  name: '',
  image: '',
  lastWatered: '',
  nextWater: '',
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
    })
    navigate('/myplants')
  }

  return (
    <>
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
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}
