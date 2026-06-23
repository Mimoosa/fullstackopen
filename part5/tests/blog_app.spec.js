const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith, getBlogRow } = require('./helper')

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
      await expect(page.getByText(/logged in/)).toBeVisible()
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
      const blogTitle = page.getByText('The best travel experience')
      const blogRow = blogTitle.locator(
        'xpath=ancestor::div[contains(@style,"border")]'
      )

      await expect(blogRow).toContainText('The best travel experience')
    })

    test('a blog can be liked', async ({ page }) => {
      const otherBlogTitle = page.getByText('The best travel experience')
      const otherBlogElement = otherBlogTitle.locator('..')

      await otherBlogElement.getByRole('button', { name: 'like' }).click()

      await expect(otherBlogElement.getByText('likes 1')).toBeVisible()
    })

    test('the user who added the blog can delete the blog', async ({
      page
    }) => {
      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      const blogTitle = page.getByText('The best travel experience')
      const blogRow = blogTitle.locator(
        'xpath=ancestor::div[contains(@style,"border")]'
      )

      await blogRow.getByRole('button', { name: 'remove' }).click()

      await expect(blogRow).not.toBeVisible()
    })
    describe('remove button', () => {
      test('the user who added the blog sees the remove button', async ({
        page
      }) => {
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })

      test('the user who did not add the blog cannot see the remove button', async ({
        page
      }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'root', 'salainen')

        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })

    test('the blogs are arranged in the order according to the likes', async ({
      page
    }) => {
      const blog1 = await createBlog(
        page,
        'The worst travel experience',
        'Mimosa',
        'https://the-worst-trip.com'
      )
      const blog2 = await createBlog(
        page,
        'The best place to visit',
        'Mimosa',
        'https://the-best-place.com'
      )

      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1.getByText('likes 1')).toBeVisible()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 1')).toBeVisible()
      await blog2.getByRole('button', { name: 'like' }).click()
      await expect(blog2.getByText('likes 2')).toBeVisible()

      const rows = page.getByTestId('blog')

      await expect(
        rows.nth(0).getByText('The best place to visit')
      ).toBeVisible()
      await expect(
        rows.nth(1).getByText('The worst travel experience')
      ).toBeVisible()
      await expect(
        rows.nth(2).getByText('The best travel experience')
      ).toBeVisible()
    })
  })
})
