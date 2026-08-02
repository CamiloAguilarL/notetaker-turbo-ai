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
}) => {
  const email = `playwright-${crypto.randomUUID()}@example.com`;

  await page.goto("/register");
  await expectNoAccessibilityViolations(page);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("playwright-secure-password-2026");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await expect(
    page.getByRole("heading", { name: "Your notes are waiting" }),
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
  await expect(page).toHaveURL(/\/notes\/[0-9a-f-]+\?from=personal$/);

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

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/notes");
  await expect(page).toHaveURL(/\/login$/);
});
