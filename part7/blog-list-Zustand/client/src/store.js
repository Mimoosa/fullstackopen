import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'

export const useNotificationStore = create((set) => ({
  message: '',
  isSuccess: false,
  actions: {
    showSuccessMessage: (value) => {
      set({ message: value, isSuccess: true })

      setTimeout(() => {
        set(() => ({ message: '', isSuccess: false }))
      }, 5000)
    },

    showErrorMessage: (value) => {
      set({ message: value, isSuccess: false })

      setTimeout(() => {
        set(() => ({ message: '', isSuccess: false }))
      }, 5000)
    }
  }
}))

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    add: async (blog) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions
      try {
        const newBlog = await blogService.create(blog)
        set((state) => ({ blogs: state.blogs.concat(newBlog) }))
        showSuccessMessage(`${newBlog.title} is added.`)
      } catch (error) {
        showErrorMessage(error?.message || `failed to add ${blog.title}`)
      }
    },
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
    remove: async (id) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions

      const blog = get().blogs.find((b) => b.id === id)
      if (!blog) {
        showErrorMessage('blog not found')
        return
      }

      if (window.confirm(`Remove blog ${blog.title}`)) {
        try {
          await blogService.deleteBlog(id)
          set((state) => ({
            blogs: state.blogs.filter((b) => b.id !== id)
          }))
          showSuccessMessage(`You delete '${blog.title}'`)
        } catch (error) {
          showErrorMessage(error?.message || 'failed to delete')
        }
      }
    },
    like: async (id) => {
      const { showSuccessMessage, showErrorMessage } =
        useNotificationStore.getState().actions
      const blog = get().blogs.find((b) => b.id === id)
      if (!blog) {
        showErrorMessage('Blog not found')
        return
      }

      try {
        const updated = await blogService.update(id, {
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id || blog.user
        })
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? updated : b))
        }))
        showSuccessMessage(`You liked '${updated.title}'`)
      } catch (error) {
        showErrorMessage(
          error?.message || `failed to like the blog ${blog.title}`
        )
      }
    }
  }
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)

const useUserStore = create((set) => ({
  user: null,
  actions: {
    setToken: () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (!loggedUserJSON) return
      const user = JSON.parse(loggedUserJSON)
      set({ user })
      blogService.setToken(user.token)
    },

    login: async ({ username, password }) => {
      const { showErrorMessage } = useNotificationStore.getState().actions
      try {
        const user = await loginService.login({
          username,
          password
        })
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        blogService.setToken(user.token)
        set({ user })
      } catch {
        showErrorMessage('wrong username or password')
      }
    },

    logout: () => {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      set({ user: null })
    }
  }
}))

export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)
