import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('AURA Main User Flow', () => {
  test('complete fragrance discovery journey with accessibility checks', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/')

    // SCAN 1: Landing page initial state
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    // Verify hero section is visible
    await expect(page.locator('h1')).toContainText('AURA')

    // Screenshot: Landing page
    await page.screenshot({ path: 'e2e/screenshots/01-landing.png', fullPage: true })

    // Click "Start Your Journey" or equivalent CTA
    const startButton = page.getByRole('button', { name: /start|begin|discover/i })
    if (await startButton.count() > 0) {
      await startButton.first().click()
    } else {
      // Alternative: navigate directly to AURA experience
      await page.goto('/aura')
    }

    // Wait for quiz to load
    await page.waitForSelector('.quiz-container', { timeout: 10000 })

    // SCAN 2: Quiz initial state
    const quizScan = await new AxeBuilder({ page }).analyze()
    expect(quizScan.violations).toEqual([])

    // Screenshot: Quiz start
    await page.screenshot({ path: 'e2e/screenshots/02-quiz-start.png', fullPage: true })

    // Answer first question (MBTI - EI dimension)
    const firstOption = page.locator('.quiz-option').first()
    await expect(firstOption).toBeVisible()
    await firstOption.click()

    // Wait for transition
    await page.waitForTimeout(500)

    // Answer second question (MBTI - SN dimension)
    await page.waitForSelector('.quiz-option')
    await page.locator('.quiz-option').first().click()
    await page.waitForTimeout(500)

    // Answer third question (MBTI - TF dimension)
    await page.waitForSelector('.quiz-option')
    await page.locator('.quiz-option').first().click()
    await page.waitForTimeout(500)

    // Answer fourth question (MBTI - JP dimension)
    await page.waitForSelector('.quiz-option')
    await page.locator('.quiz-option').first().click()
    await page.waitForTimeout(500)

    // Answer fifth question (Scent preference)
    await page.waitForSelector('.quiz-option')
    await page.locator('.quiz-option').first().click()

    // Wait for results to load
    await page.waitForSelector('canvas', { timeout: 15000 }) // Radar chart

    // SCAN 3: Results page with profile
    const resultsScan = await new AxeBuilder({ page }).analyze()
    expect(resultsScan.violations).toEqual([])

    // Screenshot: Results displayed
    await page.screenshot({ path: 'e2e/screenshots/03-results.png', fullPage: true })

    // Verify radar chart is rendered
    const radarChart = page.locator('canvas')
    await expect(radarChart).toBeVisible()

    // Verify fragrance matches are displayed
    const matchCards = page.locator('.match-card')
    await expect(matchCards.first()).toBeVisible()

    // Verify scent vault save option
    const vaultButton = page.getByRole('button', { name: /save|vault/i })
    if (await vaultButton.count() > 0) {
      await expect(vaultButton.first()).toBeVisible()

      // Click to open vault modal
      await vaultButton.first().click()
      await page.waitForTimeout(300)

      // SCAN 4: Vault modal (if present)
      const modalVisible = await page.locator('[role="dialog"]').count() > 0
      if (modalVisible) {
        const modalScan = await new AxeBuilder({ page }).analyze()
        expect(modalScan.violations).toEqual([])

        await page.screenshot({ path: 'e2e/screenshots/04-vault-modal.png', fullPage: true })

        // Close modal with Escape key
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      }
    }

    // Test localStorage persistence
    const vectorData = await page.evaluate(() => {
      return localStorage.getItem('aura-vector')
    })
    expect(vectorData).toBeTruthy()

    // Reload page to test state persistence
    await page.reload()
    await page.waitForTimeout(1000)

    // Verify state persists after reload
    const vectorAfterReload = await page.evaluate(() => {
      return localStorage.getItem('aura-vector')
    })
    expect(vectorAfterReload).toBe(vectorData)

    // Final screenshot
    await page.screenshot({ path: 'e2e/screenshots/05-final-state.png', fullPage: true })
  })

  test('keyboard navigation works throughout the flow', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verify focus is visible
    const focused = await page.evaluate(() => {
      const activeElement = document.activeElement
      return activeElement?.tagName
    })
    expect(focused).toBeTruthy()

    // Check that focus indicators are visible
    await expect(page.locator(':focus')).toBeVisible()
  })

  test('NEXUS e-commerce flow', async ({ page }) => {
    await page.goto('/nexus')

    // SCAN: NEXUS landing
    const nexusScan = await new AxeBuilder({ page }).analyze()
    expect(nexusScan.violations).toEqual([])

    // Verify product grid
    const productCards = page.locator('.product-card')
    await expect(productCards.first()).toBeVisible()

    // Add product to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart/i }).first()
    await addToCartButton.click()

    // Verify toast notification
    const toast = page.locator('.toast')
    await expect(toast).toBeVisible()

    // Open cart
    const cartButton = page.getByRole('button', { name: /cart/i })
    await cartButton.click()

    // Verify cart sidebar opens
    const cartSidebar = page.locator('.cart-sidebar')
    await expect(cartSidebar).toHaveClass(/open/)

    // SCAN: Cart sidebar open
    const cartScan = await new AxeBuilder({ page }).analyze()
    expect(cartScan.violations).toEqual([])

    // Close cart with Escape
    await page.keyboard.press('Escape')
    await expect(cartSidebar).not.toHaveClass(/open/)

    await page.screenshot({ path: 'e2e/screenshots/06-nexus.png', fullPage: true })
  })

  test('mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    // Check mobile layout
    const mobileScan = await new AxeBuilder({ page }).analyze()
    expect(mobileScan.violations).toEqual([])

    await page.screenshot({ path: 'e2e/screenshots/07-mobile.png', fullPage: true })
  })

  test('navigation between AURA and NEXUS', async ({ page }) => {
    await page.goto('/')

    // Navigate to NEXUS
    const nexusLink = page.getByRole('link', { name: /nexus|shop/i })
    if (await nexusLink.count() > 0) {
      await nexusLink.first().click()
      await expect(page).toHaveURL(/nexus/)
    }

    // Navigate back to AURA
    const auraLink = page.getByRole('link', { name: /aura|home/i })
    if (await auraLink.count() > 0) {
      await auraLink.first().click()
      await expect(page).toHaveURL(/^(?!.*nexus).*$/)
    }
  })
})
