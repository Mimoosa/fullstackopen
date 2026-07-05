import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS':
      return { message: action.payload, isSuccess: true }
    case 'ERROR':
      return { message: action.payload, isSuccess: false }
    case 'CLEAR':
      return { message: '', isSuccess: false }
    default:
      return state
  }
}

export const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    message: '',
    isSuccess: false
  })

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}
