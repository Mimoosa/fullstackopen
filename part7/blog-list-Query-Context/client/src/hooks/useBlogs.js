import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../requests'

export const useBlogs = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) ?? []
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  return {
    blogs: result.data ?? [],
    isPending: result.isPending,
    isError: result.isError,
    addBlog: (newBlog, options) => newBlogMutation.mutate(newBlog, options),
    like: (blog, options) =>
      updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 }, options),
    deleteBlog: (id, options) => deleteBlogMutation.mutate(id, options)
  }
}
