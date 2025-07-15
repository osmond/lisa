import { Routes, Route, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useRef } from 'react'
import Home from './pages/Home'
import MyPlants from './pages/MyPlants'
import Tasks from './pages/Tasks'
import CareView from './pages/CareView'
import Add from './pages/Add'
import Settings from './pages/Settings'
import PlantDetail from './pages/PlantDetail'
import EditPlant from './pages/EditPlant'
import BottomNav from './components/BottomNav'
import Fab from './components/Fab'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  const nodeRef = useRef(null)
  return (
    <div id="main-content" className="pb-24 px-4 pt-8 font-body overflow-hidden">{/* bottom padding for nav */}

      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          classNames="fade"
          timeout={200}
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/care" element={<CareView />} />
            <Route path="/myplants" element={<MyPlants />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/add" element={<Add />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/plant/:id/edit" element={<EditPlant />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          </div>
        </CSSTransition>
      </SwitchTransition>


      <Fab />
      <BottomNav />
    </div>
  )
}
