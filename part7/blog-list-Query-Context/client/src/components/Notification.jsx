import { Alert } from '@mui/material'
import { useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'

const Notification = () => {
  const { state } = useContext(NotificationContext)

  if (!state.message) return null

  return (
    <Alert severity={state.isSuccess ? 'success' : 'error'} sx={{ mb: 2 }}>
      {state.message}
    </Alert>
  )
}

export default Notification
