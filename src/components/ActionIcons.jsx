import {
  ArrowCounterClockwise,
  Drop,
  Image,
  Notebook,
  Note,
  Sun,
} from 'phosphor-react'

const iconProps = {
  className: 'w-6 h-6 text-gray-500 dark:text-gray-400',
  'aria-hidden': 'true',
}
export const WaterIcon = () => <Drop {...iconProps} />

export const FertilizeIcon = () => <Sun {...iconProps} />

export const RotateIcon = () => <ArrowCounterClockwise {...iconProps} />

export const NoteIcon = () => <Note {...iconProps} />

export const LogIcon = () => <Notebook {...iconProps} />

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
