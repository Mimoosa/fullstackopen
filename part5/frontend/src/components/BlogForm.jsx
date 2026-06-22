import Input from './Input'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <Input
          title="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          title="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
        <Input
          title="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
