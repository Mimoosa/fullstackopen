import { Card, CardContent, Typography, Button, Box, Link } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import useNotify from '../hooks/useNotify'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, username }) => {
  const { like, deleteBlog } = useBlogs()
  const { dispatch } = useNotify()
  const navigate = useNavigate()
  if (!blog) {
    return null
  }

  const handleLikesButtonClick = async (blogObject) => {
    like(blogObject, {
      onSuccess: () => {
        dispatch({
          type: 'SUCCESS',
          payload: `You liked the blog '${blogObject.title}'`
        })
        setTimeout(() => {
          dispatch({ type: 'CLEAR' })
        }, 5000)
        navigate('/')
      },
      onError: (error) => {
        dispatch({
          type: 'ERROR',
          payload: error.response?.data?.error || 'failed to like the blog'
        })
        setTimeout(() => {
          dispatch({ type: 'CLEAR' })
        }, 5000)
      }
    })
  }

  const handleRemoveButtonClick = async (blogId, blogTitle, blogAuthor) => {
    if (window.confirm(`Remove blog ${blogTitle} by ${blogAuthor}`)) {
      deleteBlog(blogId, {
        onSuccess: () => {
          dispatch({
            type: 'SUCCESS',
            payload: `You deleted the blog '${blogTitle}'`
          })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)

          navigate('/')
        },
        onError: (error) => {
          dispatch({
            type: 'ERROR',
            payload: error.response?.data?.error || 'failed to delete the blog'
          })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)
        }
      })
    }
  }
  return (
    <div data-testid="blog">
      <Card sx={{ maxWidth: 600, mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            by {blog.author}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
              color="primary"
            >
              {blog.url}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Added by {blog.user.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
            <Typography variant="h6">{blog.likes} likes</Typography>
            {username && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleLikesButtonClick(blog)}
              >
                like
              </Button>
            )}
            {username && blog.user && blog.user.username === username && (
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleRemoveButtonClick(blog.id, blog.title, blog.author)
                }
              >
                remove
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
