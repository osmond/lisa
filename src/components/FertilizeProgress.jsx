import { Sun } from 'phosphor-react'
import IconProgress from './IconProgress.jsx'

export default function FertilizeProgress(props) {
  return (
    <IconProgress
      icon={Sun}
      completedColor="text-yellow-500"
      testId="fert-progress-bar"
      itemTestId="fert-drop"
      itemLabelPrefix="Fertilizer drop"
      {...props}
    />
  )
}
