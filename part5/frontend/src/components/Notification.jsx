const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  }

  let notificationStyle = {}

  if (isSuccess) {
    notificationStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    }
  } else {
    notificationStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    }
  }

  return <div style={notificationStyle}>{message}</div>
}

export default Notification
