import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import Gallery from './pages/Gallery'

export default function App() {
  return (
    <div className="p-4 font-sans">
      <nav className="flex justify-around border-b pb-2 mb-4 text-sm text-green-700 font-medium">
        <Link to="/">Home</Link>
        <Link to="/timeline">Timeline</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  )
}
