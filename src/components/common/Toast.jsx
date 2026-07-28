function Toast({ isVisible, message }) {
  if (!isVisible) return null

  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}

export default Toast
