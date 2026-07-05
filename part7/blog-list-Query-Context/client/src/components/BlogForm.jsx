import Input from './Input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import useNotify from '../hooks/useNotify'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const { dispatch } = useNotify()

  const { addBlog: addBlogToServer } = useBlogs()

  const addBlog = (event) => {
    event.preventDefault()
    addBlogToServer(
      {
        title: title,
        author: author,
        url: url
      },
      {
        onSuccess: () => {
          dispatch({ type: 'SUCCESS', payload: `new blog '${title}' is added` })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)
          navigate('/')
        },
        onError: (error) => {
          dispatch({ type: 'ERROR', payload: error.message })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)
        }
      }
    )

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form
        onSubmit={addBlog}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <TextField
          label="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          style={{ width: '400px' }}
        />

        <TextField
          label="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          style={{ width: '400px' }}
        />
        <TextField
          label="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          style={{ width: '400px' }}
        />
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
