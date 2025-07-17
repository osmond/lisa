import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import MyPlants from './pages/MyPlants'
import Tasks from './pages/Tasks'
import Add from './pages/Add'
import AddRoom from './pages/AddRoom.jsx'
import RoomList from './pages/RoomList.jsx'
import Settings from './pages/Settings'
import PlantDetail from './pages/PlantDetail'
import EditPlant from './pages/EditPlant'
import Timeline from './pages/Timeline'
import Gallery from './pages/Gallery.jsx'

import BottomNav from './components/BottomNav'
import CreateFab from './components/CreateFab.jsx'

import { MenuProvider } from './MenuContext.jsx'
import NotFound from './pages/NotFound'

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <MenuProvider>
    <div id="main-content" className="pb-24 px-4 pt-8 font-body overflow-hidden">{/* bottom padding for nav */}

      <AnimatePresence mode="wait">
        <motion.div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/myplants" element={<PageTransition><MyPlants /></PageTransition>} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/add" element={<Add />} />
            <Route path="/room/add" element={<AddRoom />} />
            <Route path="/room/:roomName" element={<PageTransition><RoomList /></PageTransition>} />
            <Route path="/room/:roomName/plant/:id" element={<PageTransition><PlantDetail /></PageTransition>} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/plant/:id" element={<PageTransition><PlantDetail /></PageTransition>} />
            <Route path="/plant/:id/edit" element={<EditPlant />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </motion.div>
      </AnimatePresence>



        <CreateFab />
        <BottomNav />
      </div>
      </MenuProvider>

  )
}
