import { defineConfig, devices } from "@playwright/test";

const inDocker = process.env.PLAYWRIGHT_DOCKER === "true";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: inDocker
      ? {
          args: ["--host-resolver-rules=MAP localhost host.docker.internal"],
        }
      : undefined,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: "chromium-compact-tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 650, height: 900 },
      },
    },
    {
      name: "chromium-compact-mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 480, height: 900 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
});
