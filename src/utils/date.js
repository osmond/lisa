export function formatMonth(key) {
  const [year, month] = key.split('-')
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${months[Number(month) - 1]} ${year}`
}

export function formatWeek(key) {
  const [year, month, day] = key.split('-').map(Number)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `Week of ${months[month - 1]} ${day}, ${year}`
}
