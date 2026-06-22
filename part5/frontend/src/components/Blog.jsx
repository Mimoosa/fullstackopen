import { useState } from 'react'

const Blog = ({ blog, handleLikesButtonClick, handleRemoveButtonClick }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}
          <button
            onClick={() =>
              handleLikesButtonClick({ ...blog, likes: blog.likes + 1 })
            }
          >
            like
          </button>
        </p>
        <p>{blog.author}</p>
        <button
          onClick={() =>
            handleRemoveButtonClick(blog.id, blog.title, blog.author)
          }
        >
          remove
        </button>
      </div>
    </div>
  )
}

export default Blog
