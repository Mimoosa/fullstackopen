const Input = ({ title, value, onChange }) => {
  return (
    <div>
      <label>
        {title}
        <input type="text" value={value} onChange={onChange} />
      </label>
    </div>
  )
}

export default Input
