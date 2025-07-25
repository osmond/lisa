import { useId } from 'react'

export default function ToggleSwitch({
  checked = false,
  onChange,
  label,
  title,
  className = '',
  ...props
}) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center cursor-pointer ${className}`}
      title={title}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        className="sr-only peer focus:outline-none"
        {...props}
      />
      <span
        className="relative inline-block w-10 h-6 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-green-600 transition-colors peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-green-300"
      >
        <span
          className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 peer-active:w-6"
        ></span>
      </span>
      {label && <span className="ml-2 select-none">{label}</span>}
    </label>
  )
}
