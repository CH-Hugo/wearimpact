import { test, expect } from '@playwright/test'

test.describe('Saisie manuelle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/saisie-manuelle')
  })

  test('la page se charge et affiche le titre', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Compose ton vêtement' })).toBeVisible()
  })

  test('le select matière est présent', async ({ page }) => {
    const select = page.locator('select[aria-label="Matière 1"]')
    await expect(select).toBeVisible()
  })

  test('le bouton Calculer est désactivé si le total est différent de 100%', async ({ page }) => {
    const input = page.locator('input[aria-label="Pourcentage matière 1"]')
    await input.fill('50')
    await input.blur()

    const bouton = page.getByRole('button', { name: /Calculer/i })
    await expect(bouton).toBeDisabled()
  })

  test('le bouton Calculer est actif quand le total est 100%', async ({ page }) => {
    const input = page.locator('input[aria-label="Pourcentage matière 1"]')
    await input.fill('100')
    await input.blur()

    const bouton = page.getByRole('button', { name: /Calculer/i })
    await expect(bouton).toBeEnabled()
  })
})
