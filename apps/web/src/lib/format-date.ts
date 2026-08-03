const noteDateThisYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const noteDatePreviousYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const noteTimestamp = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

const MILLISECONDS_PER_DAY = 86_400_000;

function utcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function formatNoteDate(value: string, referenceValue: Date): string {
  const date = new Date(value);
  const dayDifference = Math.round(
    (utcDay(referenceValue) - utcDay(date)) / MILLISECONDS_PER_DAY,
  );

  if (dayDifference === 0) return "Today";
  if (dayDifference === 1) return "Yesterday";
  if (date.getUTCFullYear() === referenceValue.getUTCFullYear()) {
    return noteDateThisYear.format(date);
  }

  return noteDatePreviousYear.format(date);
}

export function formatNoteTimestamp(value: string): string {
  return noteTimestamp.format(new Date(value));
}
