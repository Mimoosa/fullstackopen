import { useState, useEffect } from 'react'
import { useMatch, Routes, Route, Link, Navigate } from 'react-router-dom'

import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Button from './components/Button'
import Home from './components/Home'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import { Container } from '@mui/material'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useBlogs } from './hooks/useBlogs'
import useNotify from './hooks/useNotify'
import useUser from './hooks/useUser'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user, setUser } = useUser()

  const { blogs, isPending, isError } = useBlogs()
  const { dispatch } = useNotify()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>
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
      dispatch({ type: 'ERROR', payload: 'wrong username or password' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  return (
    <Container>
      <Navbar user={user} handleLogout={handleLogout} />
      <ErrorBoundary>
        <div>
          <Routes>
            <Route path="/" element={<Home blogs={blogs} />} />

            <Route
              path="/login"
              element={
                !user ? (
                  <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/create"
              element={user ? <BlogForm /> : <Navigate to="/login" />}
            />

            <Route
              path="/blogs/:id"
              element={<Blog blog={blog} username={user?.username} />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Container>
  )
}

export default App
