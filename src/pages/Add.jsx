import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlants, addBase } from '../PlantContext.jsx'
import PageContainer from '../components/PageContainer.jsx'
import AddPlantForm from '../components/AddPlantForm.tsx'
import usePlaceholderPhoto from '../hooks/usePlaceholderPhoto.js'
import useToast from '../hooks/useToast.jsx'

export default function Add() {
  const { addPlant } = usePlants()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const placeholder = usePlaceholderPhoto(name)
  const { Toast, showToast } = useToast()

  const handleSubmit = data => {
    const imagePath = addBase(data.image || placeholder?.src || '')
    addPlant({
      ...data,
      image: imagePath,
      diameter: Number(data.diameter) || 0,
      ...(data.humidity && { humidity: Number(data.humidity) })
    })
    showToast('Added')
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <>
      <Toast />
      <PageContainer size="md">
        <AddPlantForm mode="add" onSubmit={handleSubmit} onNameChange={setName} />
      </PageContainer>
    </>
  )
}
