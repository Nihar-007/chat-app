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