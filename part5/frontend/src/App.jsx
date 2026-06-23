import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Button from './components/Button'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setSuccessMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleLikesButtonClick = async (blogObject) => {
    try {
      const fixedBlogObject = {
        ...blogObject,
        user: blogObject.user.id || blogObject.user
      }
      const returnedBlog = await blogService.update(
        blogObject.id,
        fixedBlogObject
      )
      const updatedBlogs = blogs.map((blog) =>
        blog.id === blogObject.id ? returnedBlog : blog
      )

      setBlogs(updatedBlogs)
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'failed to update likes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleRemoveButtonClick = async (blogId, blogTitle, blogAuthor) => {
    if (window.confirm(`Remove blog ${blogTitle} by ${blogAuthor}`)) {
      try {
        await blogService.deleteBlog(blogId)
        setBlogs(blogs.filter((blog) => blog.id !== blogId))
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error || 'failed to delete the blog'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }
    }
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={errorMessage} isSuccess={false} />
      <Notification message={successMessage} isSuccess={true} />
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <Button onClick={handleLogout} text="logout" />
          </p>
          {
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          }
        </div>
      )}
      {user && (
        <BlogList
          blogs={blogs}
          handleLikesButtonClick={handleLikesButtonClick}
          handleRemoveButtonClick={handleRemoveButtonClick}
          username={user.username}
        />
      )}
    </div>
  )
}

export default App
