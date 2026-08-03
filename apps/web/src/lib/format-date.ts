const noteDate = new Intl.DateTimeFormat("en-US", {
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

export function formatNoteDate(value: string): string {
  return noteDate.format(new Date(value));
}

export function formatNoteTimestamp(value: string): string {
  return noteTimestamp.format(new Date(value));
}
