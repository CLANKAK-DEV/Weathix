// Short weekday label for a unix timestamp ("Mon", "Tue"), with an override for today.
export function dayLabel(dt, { today } = {}) {
  const d = new Date(dt * 1000);
  const t = new Date();
  const isToday =
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate();
  if (isToday && today) return today;
  return d.toLocaleDateString([], { weekday: 'short' });
}
