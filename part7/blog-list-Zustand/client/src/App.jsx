import { useState, useEffect } from 'react'
import { useMatch, Routes, Route, Link, Navigate } from 'react-router-dom'

import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Button from './components/Button'
import Home from './components/Home'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import { Container } from '@mui/material'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { useBlogs, useBlogActions, useUser, useUserActions } from './store'
import userService from './services/users'
import UserList from './components/UserList'
import User from './components/User'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])

  const { initialize } = useBlogActions()
  const blogs = useBlogs()
  const user = useUser()
  const { setToken } = useUserActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  useEffect(() => {
    setToken()
  }, [setToken])

  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  const userMatch = useMatch('/users/:id')
  const userDetails = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  return (
    <Container>
      <Navbar user={user} />
      <ErrorBoundary>
        <div>
          <Routes>
            <Route path="/" element={<Home username={user?.username} />} />

            <Route
              path="/login"
              element={
                !user ? (
                  <LoginForm
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

            <Route
              path="/users"
              element={
                user ? <UserList users={users} /> : <Navigate to="/login" />
              }
            />

            <Route path="/users/:id" element={<User user={userDetails} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Container>
  )
}

export default App
