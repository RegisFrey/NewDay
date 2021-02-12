/**
 * https://stackoverflow.com/a/2483476
 * by daysBetween
 */
export function daysBetween(first: Date, second: Date): number {
  // Copy date parts of the timestamps, discarding the time parts.
  const one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
  const two = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  );

  // Do the math.
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisBetween = two.getTime() - one.getTime();
  const days = millisBetween / millisecondsPerDay;

  // Round down.
  return Math.floor(days);
}

export function localizeDatetime(dateTime: string, timeZone?: string): string {
  timeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(dateTime).toLocaleString('en-US', { timeZone });
}

export function localizeDatetimeToDate(
  dateTime: string,
  timeZone?: string,
): Date {
  timeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(localizeDatetime(dateTime, timeZone));
}

export function timeInTimezone(date: string, timeZone?: string): string {
  const _date = new Date(date);
  timeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone,
  }).format(_date);
}

export function hoursInMs(minutes: number): number {
  return minutes * 3600000; //  60 m * 60 s * 1000 ms
}

export function addHours(date: Date, hours: number): Date {
  const _date = new Date(date);
  _date.setTime(date.getTime() + hoursInMs(hours));
  return _date;
}

export function minutesInMs(minutes: number): number {
  return minutes * 60000; // 60 s * 1000 ms
}

export function addMinutes(date: Date, minutes: number): Date {
  const _date = new Date(date);
  _date.setTime(date.getTime() + minutesInMs(minutes));
  return _date;
}

/* https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects */
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function jsonDateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
}
