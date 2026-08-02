import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .exclude("nextjs-portal")
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

test("a user can capture, organize, and reopen a private note", async ({
  page,
}, testInfo) => {
  const email = `playwright-${crypto.randomUUID()}@example.com`;

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your thoughts, in a softer place." }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expectNoAccessibilityViolations(page);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("playwright-secure-password-2026");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await expect(
    page.getByRole("heading", {
      name: "I’m just here waiting for your charming notes…",
    }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "New Note" }).click();
  await expect(page).toHaveURL(/\/notes\/[0-9a-f-]+$/);

  await page.getByLabel("Note title").fill("An end-to-end thought");
  await page
    .getByLabel("Note content")
    .fill("The core notebook journey is covered by a real browser.");
  await page.getByLabel("Category").selectOption("personal");

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

  await page.getByLabel("Category").selectOption("school");
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
  await expect(page.getByRole("option", { name: "Category" })).toHaveCount(0);

  await page
    .getByRole("combobox", { name: "Sort notes" })
    .selectOption("updated_at");
  await expect(page).toHaveURL(
    /\/notes\?category=school&q=browser&ordering=updated_at$/,
  );
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page).toHaveURL(/\/notes\?category=school&ordering=updated_at$/);

  await page.getByRole("link", { name: /All Categories\s*1/ }).click();
  await expect(page).toHaveURL(/\/notes\?ordering=updated_at$/);
  await expect(page.getByRole("option", { name: "Category" })).toBeAttached();

  await page.getByLabel("Search notes").fill("missing phrase");
  await expect(page).toHaveURL(
    /\/notes\?q=missing\+phrase&ordering=updated_at$/,
  );
  await expect(
    page.getByRole("heading", { name: "No notes match “missing phrase”" }),
  ).toBeVisible();
  await expectNoAccessibilityViolations(page);

  await page.getByRole("button", { name: "Clear search" }).click();
  await page
    .getByRole("combobox", { name: "Sort notes" })
    .selectOption("category");
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

  await page
    .getByRole("combobox", { name: "Sort notes" })
    .selectOption("manual");
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
