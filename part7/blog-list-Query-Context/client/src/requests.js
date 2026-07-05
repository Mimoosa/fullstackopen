import blogService from './services/blogs'

export const getBlogs = async () => {
  try {
    return await blogService.getAll()
  } catch (error) {
    throw new Error(error.response?.data?.error || 'failed to get blogs')
  }
}

export const createBlog = async (newBlog) => {
  try {
    return await blogService.create(newBlog)
  } catch (error) {
    throw new Error(error.response?.data?.error || 'failed to add new blog')
  }
}

export const updateBlog = async (updatedBlog) => {
  try {
    const fixedBlogObject = {
      ...updatedBlog,
      user: updatedBlog.user.id || updatedBlog.user
    }
    return await blogService.update(updatedBlog.id, fixedBlogObject)
  } catch (error) {
    throw new Error(error.response?.data?.error || 'failed to like the blog')
  }
}

export const deleteBlog = async (id) => {
  try {
    return await blogService.deleteBlog(id)
  } catch (error) {
    throw new Error(error.response?.data?.error || 'failed to delete the blog')
  }
}
