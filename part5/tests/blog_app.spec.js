const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Super user',
        username: 'root',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('blogs')
    await expect(locator).toBeVisible()
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByRole('button', { name: 'login' })
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await createBlog(
        page,
        'The best travel experience',
        'Mimosa',
        'https://the-best-trip.com'
      )
    })

    test('a new blog can be created', async ({ page }) => {
      const blogRow = page
        .getByRole('button', { name: 'view' })
        .first()
        .locator('..')
      await expect(blogRow).toContainText('The best travel experience')
    })

    test('a blog can be liked', async ({ page }) => {
      const otherBlogTitle = page.getByText('The best travel experience')
      const otherBlogElement = otherBlogTitle.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view' }).click()
      await otherBlogElement.getByRole('button', { name: 'like' }).click()

      await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
    })

    test('the user who added the blog can delete the blog', async ({
      page
    }) => {
      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.reload()

      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('The best travel experience')
      ).not.toBeVisible()
    })
    describe('remove button', () => {
      test('the user who added the blog sees the remove button', async ({
        page
      }) => {
        await page.reload()
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })

      test('the user who did not add the blog cannot see the remove button', async ({
        page
      }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'root', 'salainen')

        await page.getByRole('button', { name: 'view' }).click()

        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })
  })
})
