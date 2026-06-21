import Input from './Input'

const BlogForm = ({
  addBlog,
  title,
  handleTitleChange,
  author,
  handleAuthorChange,
  url,
  handleUrlChange
}) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      <Input title="title" value={title} onChange={handleTitleChange} />
      <Input title="author" value={author} onChange={handleAuthorChange} />
      <Input title="url" value={url} onChange={handleUrlChange} />
      <button type="submit">create</button>
    </form>
  </div>
)

export default BlogForm
