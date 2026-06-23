const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('write title').fill(title)
  await page.getByPlaceholder('write author').fill(author)
  await page.getByPlaceholder('write url').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
  const blogTitle = page.getByText(title)
  const blogRow = blogTitle.locator(
    'xpath=ancestor::div[contains(@style,"border")]'
  )

  await blogRow.getByRole('button', { name: 'view' }).click()
  return blogRow
}

const getBlogRow = (page, title) =>
  page
    .getByText(title)
    .locator('xpath=ancestor::div[contains(@style,"border")]')

export { loginWith, createBlog, getBlogRow }
