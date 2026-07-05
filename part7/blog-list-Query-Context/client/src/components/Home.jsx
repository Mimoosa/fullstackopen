import BlogList from './BlogList'
import Notification from './Notification'

const Home = ({ blogs }) => {
  return (
    <div>
      <h1>blogs</h1>
      <Notification />

      <BlogList blogs={blogs} />
    </div>
  )
}

export default Home
