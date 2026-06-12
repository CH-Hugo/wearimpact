import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {
  test('page inscription — formulaire présent', async ({ page }) => {
    await page.goto('/inscription')

    await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /Créer mon compte/i })).toBeVisible()
  })

  test('page connexion — formulaire présent', async ({ page }) => {
    await page.goto('/connexion')

    await expect(page.getByRole('heading', { name: 'Se connecter' })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible()
  })

  test('lien vers inscription depuis connexion', async ({ page }) => {
    await page.goto('/connexion')
    await page.getByRole('link', { name: "S'inscrire" }).click()
    await expect(page).toHaveURL('/inscription')
  })

  test('lien vers connexion depuis inscription', async ({ page }) => {
    await page.goto('/inscription')
    await page.getByRole('link', { name: 'Se connecter' }).click()
    await expect(page).toHaveURL('/connexion')
  })
})
