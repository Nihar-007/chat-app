import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <div>HomePage</div>
      <button onClick={() => navigate('/register')}>register</button><br />
      <button onClick={() => navigate('/login')}>Login</button><br />
      <button onClick={() => navigate('/lobby')}>Lobby</button><br />
      <button onClick={() => navigate('/chat')}>chat</button><br />
    </div>
  )
}

export default HomePage