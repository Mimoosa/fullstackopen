import Input from './Input'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { useBlogActions } from '../store'
import { useField } from '../hooks/useField'

const BlogForm = () => {
  const title = useField('title')
  const author = useField('author')
  const url = useField('url')
  const navigate = useNavigate()
  const { add } = useBlogActions()

  const addBlog = (event) => {
    event.preventDefault()
    add({
      title: title.value,
      author: author.value,
      url: url.value
    })

    navigate('/')

    title.setValue('')
    author.setValue('')
    url.setValue('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form
        onSubmit={addBlog}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <TextField
          label={title.label}
          value={title.value}
          onChange={title.onChange}
          style={{ width: '400px' }}
        />

        <TextField
          label={author.label}
          value={author.value}
          onChange={author.onChange}
          style={{ width: '400px' }}
        />
        <TextField
          label={url.label}
          value={url.value}
          onChange={url.onChange}
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
