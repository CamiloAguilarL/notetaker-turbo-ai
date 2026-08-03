import { afterEach, describe, expect, it, vi } from "vitest";

describe("formatNoteDate", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("keeps the displayed date stable across viewer time zones", async () => {
    vi.stubEnv("TZ", "America/Bogota");
    vi.resetModules();
    const { formatNoteDate } = await import("@/lib/format-date");

    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
      "America/Bogota",
    );
    expect(
      formatNoteDate("2026-08-03T02:21:12Z", new Date("2026-08-03T23:00:00Z")),
    ).toBe("Today");
  });

  it("uses relative labels and only includes a year for older dates", async () => {
    const { formatNoteDate } = await import("@/lib/format-date");
    const reference = new Date("2026-08-03T12:00:00Z");

    expect(formatNoteDate("2026-08-03T01:00:00Z", reference)).toBe("Today");
    expect(formatNoteDate("2026-08-02T23:00:00Z", reference)).toBe("Yesterday");
    expect(formatNoteDate("2026-07-20T12:00:00Z", reference)).toBe("Jul 20");
    expect(formatNoteDate("2025-12-31T12:00:00Z", reference)).toBe(
      "Dec 31, 2025",
    );
  });
});
