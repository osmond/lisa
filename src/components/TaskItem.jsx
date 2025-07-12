import { Link } from 'react-router-dom'

function IconWrapper({ children }) {
  return (
    <svg
      className="w-6 h-6 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      {children}
    </svg>
  )
}

const WaterIcon = () => (
  <IconWrapper>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m15 11.25 1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 1 0-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25 12.75 9"
    />
  </IconWrapper>
)

const FertilizeIcon = () => (
  <IconWrapper>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
    />
  </IconWrapper>
)

const RotateIcon = () => (
  <IconWrapper>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </IconWrapper>
)

const icons = {
  Water: WaterIcon,
  Fertilize: FertilizeIcon,
  Rotate: RotateIcon,
}

export default function TaskItem({ task }) {
  const Icon = icons[task.type]
  return (
    <Link
      to={`/plant/${task.plantId}`}
      className="flex items-center gap-2 p-2 border rounded-lg bg-white hover:bg-gray-50"
    >
      <img
        src={task.image}
        alt={task.plantName}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-1">
        <p className="font-medium">
          {task.type} {task.plantName}
        </p>
      </div>
      {Icon && <Icon />}
      <button className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
        Mark as Done
      </button>
    </Link>
  )
}
