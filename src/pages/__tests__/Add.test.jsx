import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Add from '../Add.jsx'
import MyPlants from '../MyPlants.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

test('user can complete steps and add a plant', () => {
  render(
    <PlantProvider>
      <MemoryRouter initialEntries={['/add']}>
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/myplants" element={<MyPlants />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  // step 1
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'Test Plant' },
  })
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 2
  expect(screen.getByLabelText(/image url/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))

  // step 3
  expect(screen.getByLabelText(/last watered/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  expect(screen.getByRole('heading', { name: /my plants/i })).toBeInTheDocument()
  expect(screen.getByText('Test Plant')).toBeInTheDocument()
})
