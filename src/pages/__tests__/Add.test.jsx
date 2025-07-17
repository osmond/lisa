import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Add from '../Add.jsx'
import MyPlants from '../MyPlants.jsx'
import { PlantProvider } from '../../PlantContext.jsx'
import { RoomProvider } from '../../RoomContext.jsx'

test('user can complete steps and add a plant', () => {
  render(
    <PlantProvider>
      <RoomProvider>
        <MemoryRouter initialEntries={['/add']}>
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/myplants" element={<MyPlants />} />
          </Routes>
        </MemoryRouter>
      </RoomProvider>
    </PlantProvider>
  )

  // step 1
  expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test Plant' },
  })
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 2
  expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/image url/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 3
  expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/last watered/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 4
  expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/room/i)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/room/i), { target: { value: 'Desk' } })
  fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Thrives' } })
  fireEvent.change(screen.getByLabelText(/care level/i), { target: { value: 'easy' } })
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  expect(screen.getByRole('heading', { name: /my plants/i })).toBeInTheDocument()
  expect(screen.getByText('Desk')).toBeInTheDocument()
})
