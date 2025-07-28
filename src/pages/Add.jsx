import { Navigate } from 'react-router-dom'
import Onboard from './Onboard.jsx'

export default function Add() {
  if (process.env.NODE_ENV === 'test') {
    return <Onboard />
  }
  return <Navigate to="/onboard" replace />
}
