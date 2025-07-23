export function formatVolume(cubicInches) {
  const ml = Math.round(cubicInches * 16.387);
  const oz = Math.round(ml / 29.5735);
  return `${ml} mL / ${oz} oz`;
}
