import { useState } from 'react'

export const useField = (label) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    label,
    value,
    onChange,
    setValue
  }
}
