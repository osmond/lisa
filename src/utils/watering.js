export function getNextWateringDate(fromDate, weather = {}) {
  let base = new Date(fromDate);
  if (isNaN(base.getTime())) {
    base = new Date();
  }
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

export function getWateringInfo(lastWatered, weather = {}) {
  const eto = weather.eto ?? null;
  let daysSince = null;
  if (lastWatered) {
    const last = new Date(lastWatered);
    if (!isNaN(last.getTime())) {
      const today = new Date();
      daysSince = Math.max(0, Math.round((today - last) / 86400000));
    }
  }
  return { eto, daysSince };
}

export function getWateringProgress(lastWatered, nextWater, today = new Date()) {
  const last = new Date(lastWatered);
  const next = new Date(nextWater);
  if (isNaN(last) || isNaN(next) || next <= last) return 0;
  const total = (next - last) / 86400000;
  if (total <= 0) return 0;
  const elapsed = Math.min(Math.max((today - last) / 86400000, 0), total);
  return elapsed / total;
}
