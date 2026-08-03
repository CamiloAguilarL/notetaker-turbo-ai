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
    expect(formatNoteDate("2026-08-03T02:21:12Z")).toBe("Aug 3, 2026");
  });
});
