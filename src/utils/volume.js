export function cubicInchesToMl(in3 = 0) {
  const value = Number(in3)
  if (isNaN(value)) return 0
  return value * 16.387
}

export function mlToOz(ml = 0) {
  const value = Number(ml)
  if (isNaN(value)) return 0
  return value / 29.574
}
