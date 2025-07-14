import {
  ArrowCounterClockwise,
  Drop,
  Image,
  Notebook,
  Note,
  Sun,
} from 'phosphor-react'

const iconProps = {
  className: 'w-6 h-6',
  'aria-hidden': 'true',
}
export const WaterIcon = () => (
  <Drop {...iconProps} className={`text-blue-600 ${iconProps.className}`} />
)

export const FertilizeIcon = () => (
  <Sun {...iconProps} className={`text-yellow-600 ${iconProps.className}`} />
)

export const RotateIcon = () => (
  <ArrowCounterClockwise
    {...iconProps}
    className={`text-purple-600 ${iconProps.className}`}
  />
)

export const NoteIcon = () => (
  <Note {...iconProps} className={`text-gray-600 ${iconProps.className}`} />
)

export const LogIcon = () => (
  <Notebook {...iconProps} className={`text-green-600 ${iconProps.className}`} />
)

export const icons = {
  Water: WaterIcon,
  Fertilize: FertilizeIcon,
  Rotate: RotateIcon,
  Note: NoteIcon,
  Log: LogIcon,
  water: WaterIcon,
  fertilize: FertilizeIcon,
  rotate: RotateIcon,
  note: NoteIcon,
  log: LogIcon,
}

export default icons
