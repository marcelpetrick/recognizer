import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('starts a medium game, finds a match, and keeps the timer visible', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: '20 cards' }).click()
  await page.getByRole('button', { name: /start timed challenge/i }).click()

  await expect(page.getByLabel('Your current card')).toBeVisible()
  await expect(page.getByLabel('Next card')).toBeVisible()
  await expect(page.getByLabel('Elapsed time')).toBeVisible()
  await expect(page.getByText('0 of 19 matches')).toBeVisible()

  const currentLabels = await page
    .getByLabel('Your current card')
    .getByRole('button')
    .evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute('aria-label')),
    )
  const nextLabels = new Set(
    await page
      .getByLabel('Next card')
      .getByRole('button')
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getAttribute('aria-label')),
      ),
  )
  const matchingLabel = currentLabels.find((label) => nextLabels.has(label))

  expect(matchingLabel).toBeTruthy()
  await page.getByRole('button', { name: matchingLabel! }).first().click()
  await expect(page.getByText('1 of 19 matches')).toBeVisible()
})

test('main menu has no automatically detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

// Checks each element's own scrollWidth against its clientWidth, rather than
// comparing document/window widths: under real mobile device emulation the
// layout viewport can grow to match overflowing content (driven by the
// width=device-width viewport meta tag), so document vs. window comparisons
// stay equal even when a panel is genuinely overflowing its own box.
async function overflowingElements(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const selectors = ['.panel', 'h1', '.button', '.text-button', '.eyebrow']
    return Array.from(document.querySelectorAll(selectors.join(',')))
      .filter((el) => el.scrollWidth > el.clientWidth + 1)
      .map((el) => el.textContent?.trim().slice(0, 60))
  })
}

for (const { code, label } of [
  { code: 'EN', label: 'English' },
  { code: 'HR', label: 'Croatian' },
  { code: 'DE', label: 'German' },
]) {
  test(`menu and help text fits its layout in ${label}`, async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: code, exact: true }).click()
    await expect(async () => {
      expect(await overflowingElements(page)).toEqual([])
    }).toPass()

    await page.locator('.menu-help').click()
    await expect(async () => {
      expect(await overflowingElements(page)).toEqual([])
    }).toPass()
  })
}
