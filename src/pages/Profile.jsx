import { useUser } from '../UserContext.jsx'

export default function Profile() {
  const { name } = useUser()
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h1 className="text-headline leading-heading tracking-heading font-bold font-display">Hi {name}</h1>
    </div>
  )
}
