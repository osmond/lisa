import { Drop } from 'phosphor-react'
import IconProgress from './IconProgress.jsx'

export default function WaterProgress(props) {
  return (
    <IconProgress
      icon={Drop}
      completedColor="text-blue-500"
      testId="water-progress-bar"
      itemTestId="water-drop"
      itemLabelPrefix="Water drop"
      {...props}
    />
  )
}
