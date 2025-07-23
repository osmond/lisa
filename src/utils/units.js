export function formatVolume(cubicInches) {
  const ml = Math.round(cubicInches * 16.387);
  const oz = Math.round(ml / 29.5735);
  return `${ml} mL / ${oz} oz`;
}

export function formatMlOz(ml = 0, oz) {
  const m = Math.round(Number(ml) || 0);
  const o = Math.round(oz !== undefined ? oz : m / 29.574);
  return `${m} mL / ${o} oz`;
}
