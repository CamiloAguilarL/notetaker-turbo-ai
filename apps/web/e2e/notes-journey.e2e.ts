import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const LONG_UNBROKEN_TOKEN = "thought".repeat(30);

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .exclude("nextjs-portal")
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

async function chooseSelectOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function expectResponsiveDashboard(page: Page) {
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  if (!viewport) return;

  const pageWidths = await page.locator("html").evaluate((element) => ({
    client: element.clientWidth,
    scroll: element.scrollWidth,
  }));
  expect(pageWidths.scroll).toBeLessThanOrEqual(pageWidths.client);

  const grid = page.getByRole("region", { name: "All notes" });
  const columns = await grid.evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" "),
  );
  const expectedColumns =
    viewport.width >= 1280 ? 3 : viewport.width >= 560 ? 2 : 1;
  expect(columns).toHaveLength(expectedColumns);

  const cardBox = await grid.locator("article").first().boundingBox();
  expect(cardBox).not.toBeNull();
  const expectedCardHeight = Math.min(
    288,
    Math.max(208, 160 + viewport.width * 0.1),
  );
  expect(Math.round(cardBox?.height ?? 0)).toBe(expectedCardHeight);
}

async function expectCardCopyContained(page: Page, accessibleName: string) {
  const horizontalOverflow = await page
    .getByRole("link", { name: accessibleName })
    .locator("h2, p")
    .evaluateAll((elements) =>
      elements.map((element) => element.scrollWidth - element.clientWidth),
    );

  // Chromium includes a few internal pixels reserved by line-clamp's ellipsis
  // in scrollWidth. A long unbroken word without wrapping exceeds this margin
  // by hundreds of pixels.
  expect(Math.max(...horizontalOverflow)).toBeLessThanOrEqual(8);
}

test("a user can capture, organize, and reopen a private note", async ({
  page,
}, testInfo) => {
  const email = `playwright-${crypto.randomUUID()}@example.com`;

  await page.goto("/");
  await expect(page).toHaveTitle(
    "Turbo Notes — A softer place for your thoughts",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  const manifest = await page.evaluate(async () => {
    const response = await fetch("/manifest.webmanifest");
    if (!response.ok) throw new Error("Manifest could not be loaded.");
    return response.json();
  });
  expect(manifest).toMatchObject({
    name: "Turbo Notes",
    icons: [
      { src: "/icons/turbo-notes-192.png", sizes: "192x192" },
      { src: "/icons/turbo-notes-512.png", sizes: "512x512" },
    ],
  });
  await expect(
    page.getByRole("heading", { name: "Your thoughts, in a softer place." }),
  ).toBeVisible();
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await skipLink.focus();
  await expect(skipLink).toBeVisible();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expectNoAccessibilityViolations(page);
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page).toHaveTitle("Create account · Turbo Notes");
  await expectNoAccessibilityViolations(page);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("playwright-secure-password-2026");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await expect(page).toHaveTitle("Notes · Turbo Notes");
  await expect(
    page.getByRole("heading", {
      name: "I’m just here waiting for your charming notes…",
    }),
  ).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    const accountEmail = page.getByText(email, { exact: true });
    await accountEmail.focus();
    await expect(page.getByRole("tooltip")).toHaveText(email);
    await page.getByRole("button", { name: "New Note" }).focus();
    await expect(page.getByRole("tooltip")).toBeHidden();
  }
  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "New Note" }).click();
  await expect(page).toHaveURL(/\/notes\/[0-9a-f-]+$/);
  await expect(page).toHaveTitle("Edit note · Turbo Notes");

  await page.getByLabel("Note title").fill("An end-to-end thought");
  await page
    .getByLabel("Note content")
    .fill(
      `The core notebook journey is covered by a real browser. ${LONG_UNBROKEN_TOKEN}`,
    );
  await chooseSelectOption(page, "Category", "Personal");

  await expect(
    page.getByText("Unsaved changes", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await expectNoAccessibilityViolations(page);
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("link", { name: "Open An end-to-end thought" })
      .locator("time"),
  ).toHaveText("Today");
  await expectResponsiveDashboard(page);
  await expectCardCopyContained(page, "Open An end-to-end thought");
  await expect(page.getByRole("link", { name: /Personal\s*1/ })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.reload();
  await expect(page).toHaveURL(/\/notes$/);
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Personal\s*1/ }).click();
  await expect(page).toHaveURL(/\/notes\?category=personal$/);
  await page.getByRole("link", { name: "Open An end-to-end thought" }).click();
  await expect(page).toHaveURL(
    /\/notes\/[0-9a-f-]+\?return=category%3Dpersonal$/,
  );

  await chooseSelectOption(page, "Category", "School");
  await expect(
    page.getByText("Unsaved changes", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page).toHaveURL(/\/notes\?category=personal$/);
  await expect(
    page.getByRole("heading", { name: "No Personal notes yet" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /School\s*1/ })).toBeVisible();

  await page.getByRole("link", { name: /School\s*1/ }).click();
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Open An end-to-end thought" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(
    page.getByRole("alertdialog", { name: "Delete this note?" }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);
  await page.getByRole("button", { name: "Delete note" }).click();

  await expect(page).toHaveURL(/\/notes\?category=school&undo=[0-9a-f-]+$/);
  await expect(
    page.getByRole("heading", { name: "No School notes yet" }),
  ).toBeVisible();
  await expect(page.getByText("Note deleted", { exact: true })).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page).toHaveURL(/\/notes\?category=school$/);
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();

  await page.getByLabel("Search notes").fill("browser");
  await expect(page).toHaveURL(/\/notes\?category=school&q=browser$/);
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Sort notes" }).click();
  await expect(page.getByRole("option", { name: "Category" })).toHaveCount(0);
  await page
    .getByRole("option", { name: "Oldest edited", exact: true })
    .click();
  await expect(page).toHaveURL(
    /\/notes\?category=school&q=browser&ordering=updated_at$/,
  );
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page).toHaveURL(/\/notes\?category=school&ordering=updated_at$/);

  await page.getByRole("link", { name: /All Categories\s*1/ }).click();
  await expect(page).toHaveURL(/\/notes\?ordering=updated_at$/);
  await page.getByRole("combobox", { name: "Sort notes" }).click();
  await expect(page.getByRole("option", { name: "Category" })).toBeAttached();
  await page.keyboard.press("Escape");

  await page.getByLabel("Search notes").fill("missing phrase");
  await expect(page).toHaveURL(
    /\/notes\?q=missing\+phrase&ordering=updated_at$/,
  );
  await expect(
    page.getByRole("heading", { name: "No notes match “missing phrase”" }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page).toHaveURL(/\/notes\?ordering=updated_at$/);
  await chooseSelectOption(page, "Sort notes", "Category");
  await expect(page).toHaveURL(/\/notes\?ordering=category$/);
  await expect(
    page.getByRole("link", { name: "Open An end-to-end thought" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "New Note" }).click();
  await page.getByLabel("Note title").fill("A second thought");
  await page
    .getByLabel("Note content")
    .fill("This note makes manual ordering observable and persistent.");
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page).toHaveURL(/\/notes\?ordering=category$/);

  await chooseSelectOption(page, "Sort notes", "Manual order");
  await expect(page).toHaveURL(/\/notes\?ordering=manual$/);
  await expect(
    page.getByRole("listitem", {
      name: "A second thought, position 2 of 2",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "Drag A second thought to reorder",
    }),
  ).toBeVisible();
  const moveEarlier = page.getByRole("button", {
    name: "Move A second thought earlier",
  });
  await moveEarlier.focus();
  await moveEarlier.press("Enter");
  await expect(page.getByText("Manual order saved.")).toBeVisible();
  await expect(
    page.getByRole("listitem", {
      name: "A second thought, position 1 of 2",
    }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.reload();
  await expect(
    page.getByRole("listitem", {
      name: "A second thought, position 1 of 2",
    }),
  ).toBeVisible();

  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Continue to your notes" }),
  ).toHaveAttribute("href", "/notes");
  await expectNoAccessibilityViolations(page);
  await page.getByRole("link", { name: "Open notebook" }).click();
  await expect(page).toHaveURL(/\/notes$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/notes");
  await expect(page).toHaveURL(/\/login$/);

  if (testInfo.project.name === "chromium-mobile") {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const reducedMotionHero = page
      .getByRole("heading", { name: "Your thoughts, in a softer place." })
      .locator("..");
    await expect(reducedMotionHero).toBeVisible();
    await expect(reducedMotionHero).toHaveCSS("transform", "none");
    await expectNoAccessibilityViolations(page);
  }
});
