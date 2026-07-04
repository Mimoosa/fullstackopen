import { Alert } from '@mui/material'
import { useNotificationStore } from '../store'

const Notification = () => {
  const message = useNotificationStore((state) => state.message)
  const isSuccess = useNotificationStore((state) => state.isSuccess)

  if (message === '') {
    return null
  }

  return (
    <Alert severity={isSuccess ? 'success' : 'error'} sx={{ mb: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification
