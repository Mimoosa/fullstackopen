import BlogList from './BlogList'
import Notification from './Notification'
import { useBlogs } from '../store'

const Home = ({ username }) => {
  const blogs = useBlogs()

  return (
    <div>
      <h1>blogs</h1>
      <Notification />

      <BlogList blogs={blogs} username={username} />
    </div>
  )
}

export default Home
