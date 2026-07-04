import Notification from './Notification'
import { TextField, Button, Box } from '@mui/material'
import { useUserActions } from '../store'

const LoginForm = ({ username, setUsername, password, setPassword }) => {
  const { login } = useUserActions()

  const handleLogin = async (event) => {
    event.preventDefault()
    login({ username, password })
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification />
      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <TextField
          label="username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '400px' }}
        />

        <TextField
          label="password"
          type="password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '400px' }}
        />
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
