import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Add from '../Add.jsx'
import MyPlants from '../MyPlants.jsx'
import { PlantProvider } from '../../PlantContext.jsx'

// test adding a plant

test('addPlant updates context and redirects to MyPlants', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const { container } = render(
    <PlantProvider>
      <MemoryRouter initialEntries={['/add']}>
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/myplants" element={<MyPlants />} />
        </Routes>
      </MemoryRouter>
    </PlantProvider>
  )

  const nameInput = container.querySelector('input[required]')
  fireEvent.change(nameInput, { target: { value: 'Test Plant' } })

  fireEvent.click(screen.getByRole('button', { name: /add plant/i }))

  expect(screen.getByRole('heading', { name: /my plants/i })).toBeInTheDocument()
  expect(screen.getByText('Test Plant')).toBeInTheDocument()
  expect(errorSpy).not.toHaveBeenCalled()
  errorSpy.mockRestore()
})
