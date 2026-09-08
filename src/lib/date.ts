const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** yyyy-mm-dd for a date offset in days from today (local time). */
export function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

/** "09 Sep" */
export function formatShort(iso: string): string {
  const d = parseIso(iso);
  return `${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "09 September 2026" */
export function formatLong(iso: string): string {
  const d = parseIso(iso);
  return `${pad(d.getDate())} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Wednesday, 09 September" */
export function formatDayLong(iso: string): string {
  const d = parseIso(iso);
  return `${DAYS[d.getDay()]}, ${pad(d.getDate())} ${MONTHS_LONG[d.getMonth()]}`;
}

export function relativeLabel(iso: string): string | null {
  if (iso === isoDate(0)) return 'Today';
  if (iso === isoDate(1)) return 'Tomorrow';
  if (iso === isoDate(-1)) return 'Yesterday';
  return null;
}

export function weekdayShort(iso: string): string {
  return DAYS[parseIso(iso).getDay()].slice(0, 3);
}

export function dayOfMonth(iso: string): string {
  return pad(parseIso(iso).getDate());
}

/** "5:30 PM" -> minutes since midnight, for sorting. */
export function timeToMinutes(time: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

/** "17:30" (input[type=time]) -> "5:30 PM" */
export function to12Hour(value: string): string {
  const [hRaw, mRaw] = value.split(':');
  const h = Number(hRaw);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mRaw ?? '00'} ${suffix}`;
}

export function nowClock(): string {
  const d = new Date();
  const h = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  return `${h}:${pad(d.getMinutes())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${pad(m)}m`;
}
