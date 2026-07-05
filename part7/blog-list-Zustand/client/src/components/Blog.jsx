import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Link,
  TextField
} from '@mui/material'
import { useBlogActions } from '../store'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/useField'

const Blog = ({ blog, username }) => {
  const { remove, like, addComment } = useBlogActions()
  const navigate = useNavigate()
  const comment = useField('add a comment')
  if (!blog) {
    return null
  }

  const handleRemoveButtonClick = async (blogId) => {
    remove(blogId)
    navigate('/')
  }

  const handleLikesButtonClick = async (blogId) => {
    like(blogId)
    navigate('/')
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
                onClick={() => handleLikesButtonClick(blog.id)}
              >
                like
              </Button>
            )}
            {username && blog.user && blog.user.username === username && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveButtonClick(blog.id)}
              >
                remove
              </Button>
            )}
          </Box>
          <Typography
            variant="h6"
            style={{ paddingTop: 15, paddingBottom: 15 }}
          >
            comments
          </Typography>
          <TextField
            label={comment.label}
            value={comment.value}
            onChange={comment.onChange}
            style={{ width: '250px' }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: 10, paddingTop: 15, paddingBottom: 15 }}
            onClick={() => {
              addComment({ id: blog.id, comment: comment.value })
              comment.setValue('')
            }}
          >
            ADD COMMENT
          </Button>
          <ul>
            {blog.comments.map((comment, i) => (
              <li key={i}>{comment}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
