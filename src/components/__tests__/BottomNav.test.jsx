import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav.jsx'

 test('all icons are aria-hidden', () => {
   const { container } = render(
     <MemoryRouter>
       <BottomNav />
     </MemoryRouter>
   )
   const svgs = container.querySelectorAll('svg')
   svgs.forEach(svg => {
     expect(svg).toHaveAttribute('aria-hidden', 'true')
   })
 })
