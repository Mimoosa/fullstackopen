import Blog from './Blog'
const BlogList = ({
  blogs,
  handleLikesButtonClick,
  handleRemoveButtonClick,
  username
}) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLikesButtonClick={handleLikesButtonClick}
          handleRemoveButtonClick={handleRemoveButtonClick}
          username={username}
        />
      ))}
    </div>
  )
}
export default BlogList
