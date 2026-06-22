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
          placeholder="write title"
        />
        <Input
          title="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="write author"
        />
        <Input
          title="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="write url"
        />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
