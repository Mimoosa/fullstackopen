import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const noteObject = {
      content: newBlog,
      important: Math.random() > 0.5
    }

    const returnedNote = await blogService.create(noteObject)
    setBlogs(blogs.concat(returnedNote))
    setNewBlog('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setLikes(event.target.value)
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const Input = ({ title, value, onChange }) => {
    return (
      <div>
        <label>
          {title}
          <input type="text" value={value} onChange={onChange} />
        </label>
      </div>
    )
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <Input title="Name" value={title} onChange={handleTitleChange} />
      <Input title="Author" value={author} onChange={handleAuthorChange} />
      <Input title="Url" value={url} onChange={handleUrlChange} />
      <Input title="Likes" value={likes} onChange={handleLikesChange} />
      <button type="submit">save</button>
    </form>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {blogForm()}
        </div>
      )}
      {user && blogList()}
    </div>
  )
}

export default App
