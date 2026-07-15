import type { TimeValue } from '../components/common/TimeWheel';

export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function formatTime({ meridiem, hour, minute }: TimeValue) {
  return `${meridiem} ${hour}:${String(minute).padStart(2, '0')}`;
}

export function getNextHour(from: Date = new Date()): Date {
  const next = new Date(from);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return next;
}

export function toTimeValue(date: Date): TimeValue {
  const hour24 = date.getHours();
  const meridiem: TimeValue['meridiem'] = hour24 < 12 ? '오전' : '오후';
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { meridiem, hour, minute: date.getMinutes() };
}

export function combineDateAndTime(date: Date, { meridiem, hour, minute }: TimeValue): Date {
  const hour24 = meridiem === '오후' ? (hour % 12) + 12 : hour % 12;
  const combined = new Date(date);
  combined.setHours(hour24, minute, 0, 0);
  return combined;
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
