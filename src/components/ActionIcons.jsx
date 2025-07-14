import {
  ArrowCounterClockwise,
  Drop,
  Image,
  Notebook,
  Note,
  Sun,
  SkipForward,
  BellZ,
  Eye,
} from 'phosphor-react'

const iconProps = {
  size: 20,
  weight: 'regular',
  className: 'text-gray-500 dark:text-gray-400',
  'aria-hidden': 'true',
}
export const WaterIcon = () => <Drop {...iconProps} />

export const FertilizeIcon = () => <Sun {...iconProps} />

export const RotateIcon = () => <ArrowCounterClockwise {...iconProps} />

export const NoteIcon = () => <Note {...iconProps} />

export const LogIcon = () => <Notebook {...iconProps} />

export const SkipIcon = () => <SkipForward {...iconProps} />

export const SnoozeIcon = () => <BellZ {...iconProps} />

export const ViewIcon = () => <Eye {...iconProps} />

export const icons = {
  Water: WaterIcon,
  Fertilize: FertilizeIcon,
  Rotate: RotateIcon,
  Note: NoteIcon,
  Log: LogIcon,
  Skip: SkipIcon,
  Snooze: SnoozeIcon,
  View: ViewIcon,
  water: WaterIcon,
  fertilize: FertilizeIcon,
  rotate: RotateIcon,
  note: NoteIcon,
  log: LogIcon,
  skip: SkipIcon,
  snooze: SnoozeIcon,
  view: ViewIcon,
}

export default icons
