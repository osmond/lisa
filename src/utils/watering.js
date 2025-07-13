export function getNextWateringDate(fromDate, weather = {}) {
  const base = new Date(fromDate);
  base.setDate(base.getDate() + 7);

  let reason = '';
  if (weather.rainTomorrow && weather.rainTomorrow > 2) {
    base.setDate(base.getDate() + 1);
    reason = 'rain expected tomorrow';
  } else if (weather.eto && weather.eto > 6) {
    base.setDate(base.getDate() - 1);
    reason = 'high ET₀ levels';
  }

  return { date: base.toISOString().slice(0, 10), reason };
}
