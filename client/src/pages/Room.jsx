import { useState, useEffect, useCallback, use} from 'react'
import { useSocket } from '../SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../services/peer'

function Room() {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [remoteSocketId, setRemoteSocketId] = useState('')
  const [userDetails, setUserDetails] = useState({ name: '', phno: '' })
  const socket = useSocket()

  const handleUserJoin = useCallback (({ name, phno, socketID}) => {
    console.log("User details:", name, phno, socketID)
    setUserDetails({ name, phno })
    setRemoteSocketId(socketID)
  }, [])

  console.log(userDetails)

  const handleUserCall = useCallback( async () => {
    const offer = await peer.getOffer()
    console.log("Offer created:", offer)
    socket.emit("call:offer", {to: remoteSocketId, offer})
  }, [socket, remoteSocketId])

  const handleUserAnswer = useCallback( async({ offer, from, name }) => {
    const confirm = window.confirm(`Call from ${name}. Do you want to answer?`)

    if (!confirm) return socket.emit("call:declined", { to: from })
    
    setRemoteSocketId(from)
    console.log("offer Received:", from, "Offer:", offer)
    
    const answer = await peer.getAnswer(offer)
    console.log("Answer created:", answer)
    socket.emit("call:negotiate", { to: from, answer })

  }, [socket])

  const handleAnswer = useCallback( async ({ answer, from }) => {
    console.log("answer received: ", answer, " From: ",from)
    await peer.setLocalDescription(answer)
      .then(() => {
        console.log("Remote description set successfully")
      })
      .catch((error) => {
        console.error("Error setting remote description:", error)
      })

  }, [])

  const handleNegotiationNeeded = useCallback(async () => {
    console.log("Negotiation needed")
    const offer = await peer.getOffer()
    console.log("Negotiation offer created:", offer)
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer })
  }, [socket, remoteSocketId])

  const handleNegotiationOffer = useCallback( async ({ offer, from }) => {
    socket.emit("peer:nego:answer", { to: from, answer: await peer.getAnswer(offer) })
  }, [socket])

  const handleNegotiationfinal = useCallback( async ({ answer, from }) => {
    console.log("Negotiation answer received from:", from, "Answer:", answer)
    await peer.setLocalDescription(answer)
      .then(() => {
        console.log("Negotiation remote description set successfully")
      })
      .catch((error) => {
        console.error("Error setting negotiation remote description:", error)
      })
  }, [])

  const handleCallDeclined = useCallback (({ from, name}) => {
    console.log(`${name} declined the call`)
  }, [])

  useEffect(() => {
    const getLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true })
      setLocalStream(stream)
      if (peer.peer) {
        stream.getTracks().forEach(track => {
          peer.peer.addTrack(track, stream)
        })
      }
    }
    getLocalStream()
  }, [])

  useEffect(() => {
    if(!peer.peer) return
    peer.peer.addEventListener('track', (event) => {
      const remoteStream = event.streams[0]
      setRemoteStream(remoteStream)
      console.log("Remote stream received:", remoteStream)
    })
  }, [])

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded)
    }
  }, [handleNegotiationNeeded])
  
  useEffect(() => {
    socket.on("user:joined", handleUserJoin)
    socket.on("call:answer", handleUserAnswer)
    socket.on("call:final", handleAnswer)
    socket.on("call:declined", handleCallDeclined)
    socket.on("peer:nego:offer", handleNegotiationOffer)
    socket.on("peer:nego:final", handleNegotiationfinal)

    return () => {
      socket.off("user:joined", handleUserJoin)
      socket.off("call:answer", handleUserAnswer)
      socket.off("call:final", handleAnswer)
      socket.off("call:declined", handleCallDeclined)
      socket.off("peer:nego:offer", handleNegotiationOffer)
      socket.off("peer:nego:final", handleNegotiationfinal)

    }
  }, [socket, handleUserJoin, handleUserAnswer, handleAnswer, handleNegotiationOffer, handleNegotiationfinal, handleCallDeclined])

  return (
    <div>
      <h1>Room</h1>
      { remoteSocketId ? 'connected' : 'not connected'}
      { remoteSocketId && <button onClick={handleUserCall}>Call</button>}
      <div>
        <h2>Local Stream</h2>
        {localStream && <ReactPlayer url={localStream} playing muted height="300px" width="500px" />}
      </div>
      <div>
        <h2>Remote Stream</h2>
        { remoteStream && <ReactPlayer height="300px" width="500px" url={remoteStream} playing />}
      </div>
    </div>
  )
}

export default Room