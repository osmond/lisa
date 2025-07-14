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

export const WATER_INTERVALS = {
  'Snake Plant': 14,
  'ZZ Plant': 14,
  'Aloe Vera': 14,
  'Jade Plant': 14,
};

export function isFrequentWatering(careLog = [], plantName = '') {
  const interval = WATER_INTERVALS[plantName] || 7;
  const watering = careLog
    .filter(ev => /water/i.test(ev.type))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (watering.length < 2) return false;
  const last = watering[watering.length - 1];
  const prev = watering[watering.length - 2];
  const diff =
    (new Date(last.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24);
  return diff < interval / 2;
}
