import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../SocketProvider'
import { use } from 'react'

function Lobby() {
    const [name, setName] = useState('')
    const [phno, setPhno] = useState('')
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
    const navigate = useNavigate()
    const socket = useSocket()

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!name || !phno) return console.log("Please fill all fields")
        socket.emit("user:details", {name, phno})
    }
    
    const handleUserJoin = useCallback(({ name, phno, socketID }) => {
      console.log("User details:", name, phno, socketID)
      navigate(`/room/${phno}`)
    },[navigate] )

    useEffect(() => {
      socket.on("user:details", handleUserJoin)
    
      return () => {
        socket.off("user:details", handleUserJoin)
      }
    }, [socket, handleUserJoin])

  useEffect(() => {

    fetch(`${baseUrl}/api/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: "nihar", age: 21 }),
    })

    fetch(`${baseUrl}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(data => console.log('GET /api/test:', data))
      .catch(err => console.error(err))
    }, [baseUrl])
    

  return (
    <div>
        <h1>Lobby</h1>
        <label>Name: </label>
        <input type="text" placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)}/>
        <br />
        
        <label>Phone number: </label>
        <input type="text" placeholder='Enter phno' value={phno} onChange={(e) => setPhno(e.target.value)}/>
        <br />

        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
    </div>
  )
}

export default Lobby