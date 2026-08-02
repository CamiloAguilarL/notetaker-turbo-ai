const noteDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatNoteDate(value: string): string {
  return noteDate.format(new Date(value));
}
