import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let mockLike
  beforeEach(() => {
    const blog = {
      title: 'The worst trip',
      author: 'Mimosa',
      url: 'https://trips.com/the-worst-trip',
      likes: 10,
      user: {
        username: 'tester',
        name: 'Superuser',
        id: '00000000000ffffffffffffff'
      },
      id: 'ddddddd9999999999999'
    }
    mockLike = vi.fn()
    const mockRemove = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLikesButtonClick={mockLike}
        handleRemoveButtonClick={mockRemove}
        username="tester"
      />
    )
  })

  test('renders title and author', () => {
    const title = screen.getByText('The worst trip')
    expect(title).toBeDefined()

    const author = screen.getByText('Mimosa')
    expect(author).toBeDefined()
  })

  test('does not render url and likes by default', () => {
    const url = screen.getByText('https://trips.com/the-worst-trip')
    expect(url).not.toBeVisible()

    const likes = screen.getByText('likes 10')
    expect(likes).not.toBeVisible()
  })

  test(' the URL and number of likes are shown when the view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('https://trips.com/the-worst-trip')
    expect(url).toBeVisible()

    const likes = screen.getByText('likes 10')
    expect(likes).toBeVisible()
  })

  test(' the URL and number of likes are shown when the view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likesButton = screen.getByText('like')
    await user.click(likesButton)
    await user.click(likesButton)

    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
