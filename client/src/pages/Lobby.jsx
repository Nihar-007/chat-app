import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../SocketProvider'

function Lobby() {
  const [name, setName] = useState('')
  const [phno, setPhno] = useState('')
  const navigate = useNavigate()
  const socket = useSocket()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phno.trim()) {
      alert('Please fill all fields')
      return
    }
    socket.emit('user:details', { name, phno })
  }

  const handleUserJoin = useCallback(
    ({ name, phno, socketID }) => {
      console.log('User details:', name, phno, socketID)
      navigate(`/room/${phno}`)
    },
    [navigate]
  )

  useEffect(() => {
    socket.on('user:details', handleUserJoin)

    return () => {
      socket.off('user:details', handleUserJoin)
    }
  }, [socket, handleUserJoin])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-indigo-900 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md rounded-xl p-10 max-w-md w-full shadow-xl border border-white/20"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-white text-center tracking-wide">Welcome to Lobby</h1>

        <label
          htmlFor="name"
          className="block text-white text-lg font-semibold mb-2 select-none"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
          autoComplete="off"
          required
        />
        <br />

        <label
          htmlFor="phno"
          className="block text-white text-lg font-semibold mb-2 select-none"
        >
          Phone Number
        </label>
        <input
          id="phno"
          type="text"
          placeholder="Enter your phone number"
          value={phno}
          onChange={(e) => setPhno(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition"
          autoComplete="off"
          required
        />
        <br />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-600"
        >
          🚀 Enter Room
        </button>
      </form>
    </div>
  )
}

export default Lobby
