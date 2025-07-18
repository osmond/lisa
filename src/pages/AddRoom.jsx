import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from "../components/PageContainer.jsx"
import { useRooms } from '../RoomContext.jsx'

export default function AddRoom() {
  const [name, setName] = useState('')
  const { addRoom } = useRooms()
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim()) return
    addRoom(name.trim())
    navigate('/myplants')
  }

  return (
    <PageContainer>
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold font-headline">Add Room</h1>
      <div className="grid gap-1">
        <label htmlFor="room-name" className="font-medium">Room Name</label>
        <input
          id="room-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add Room</button>
    </form>
    </PageContainer>
  )
}
