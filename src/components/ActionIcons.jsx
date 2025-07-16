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
export const WaterIcon = props => <Drop {...iconProps} {...props} />

export const FertilizeIcon = props => <Sun {...iconProps} {...props} />

export const RotateIcon = props => <ArrowCounterClockwise {...iconProps} {...props} />

export const NoteIcon = props => <Note {...iconProps} {...props} />

export const LogIcon = props => <Notebook {...iconProps} {...props} />

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
  advanced: LogIcon,
  noteText: NoteIcon,
}

export default icons
