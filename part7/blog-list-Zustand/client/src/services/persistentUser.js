export const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if (!loggedUserJSON) return
  return JSON.parse(loggedUserJSON)
}
export const saveUser = (user) => {
  return window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
}
export const removeUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
}
