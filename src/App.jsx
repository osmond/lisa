import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MyPlants from './pages/MyPlants'
import Tasks from './pages/Tasks'
import Add from './pages/Add'
import Gallery, { AllGallery } from './pages/Gallery'
import Settings from './pages/Settings'
import PlantDetail from './pages/PlantDetail'
import EditPlant from './pages/EditPlant'
import BottomNav from './components/BottomNav'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="pb-16 p-4 font-sans">{/* bottom padding for nav */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myplants" element={<MyPlants />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/add" element={<Add />} />
        <Route path="/gallery" element={<AllGallery />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/plant/:id" element={<PlantDetail />} />
        <Route path="/plant/:id/edit" element={<EditPlant />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/plant/:id/gallery" element={<Gallery />} />

      </Routes>


      <BottomNav />
    </div>
  )
}
