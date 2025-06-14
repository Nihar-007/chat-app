import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../SocketProvider';
import peer from '../services/peer';
import { useNavigate } from "react-router-dom"
import ReactPlayer from 'react-player';
import "../styles/Room.css"

function Room() {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', phno: '' });
  const navigate = useNavigate()

  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => peer.peer.addTrack(track, stream));
    };
    getMedia();
  }, []);

  useEffect(() => {
    const handleTrack = (event) => {
      const inboundStream = event.streams[0];
      if (inboundStream && inboundStream.getVideoTracks().length > 0) {
        setRemoteStream(inboundStream);
      }
    };
    peer.peer.addEventListener('track', handleTrack);
    return () => peer.peer.removeEventListener('track', handleTrack);
  }, []);

  useEffect(() => {
    const handleNegotiationNeeded = async () => {
      if (!remoteSocketId) return;
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', { to: remoteSocketId, offer });
    };
    peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
    return () => peer.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
  }, [remoteSocketId, socket]);

  const handleUserJoin = useCallback(({ name, phno, socketID }) => {
    setUserDetails({ name, phno });
    setRemoteSocketId(socketID);
  }, []);

  const handleCall = useCallback(async () => {
    if (!localStream || !remoteSocketId) return;
    const offer = await peer.getOffer();
    socket.emit('call:offer', { to: remoteSocketId, offer });
  }, [remoteSocketId, localStream, socket]);

  const handleOfferReceived = useCallback(async ({ offer, from, name }) => {
    const confirm = window.confirm(`Call from ${name}. Accept?`);
    if (!confirm) return socket.emit('call:declined', { to: from });
    setRemoteSocketId(from);
    const answer = await peer.getAnswer(offer);
    socket.emit('call:negotiate', { to: from, answer });
  }, [socket]);

  const handleAnswerReceived = useCallback(async ({ answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  const handleCallDeclined = useCallback(({ name }) => {
    alert(`${name} declined the call.`);
  }, []);

  const handleNegotiationOffer = useCallback(async ({ offer, from }) => {
    const answer = await peer.getAnswer(offer);
    socket.emit('peer:nego:answer', { to: from, answer });
  }, [socket]);

  const handleNegotiationAnswer = useCallback(async ({ answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  const handleEndCall = useCallback(() => {

    if(localStream) localStream.getTracks().forEach(track => track.stop())
    if(remoteStream) remoteStream.getTracks().forEach(track => track.stop())
    peer.peer.close()
    
    socket.emit("call:end", { to: remoteSocketId })
    peer.createNewPeerConnection()

    setRemoteSocketId(null)
    setRemoteStream(null)
    navigate('/lobby')
  }, [socket, remoteSocketId, localStream, remoteStream])

  const handleUserCallEnd = useCallback (({ from }) => {
    alert("Call ended by the user")
    handleEndCall()
  }, [])
  

  useEffect(() => {
    socket.on('user:joined', handleUserJoin);
    socket.on('call:answer', handleOfferReceived);
    socket.on('call:final', handleAnswerReceived);
    socket.on('call:declined', handleCallDeclined);
    socket.on('peer:nego:offer', handleNegotiationOffer);
    socket.on('peer:nego:final', handleNegotiationAnswer);
    socket.on('call:end', handleUserCallEnd);

    return () => {
      socket.off('user:joined', handleUserJoin);
      socket.off('call:answer', handleOfferReceived);
      socket.off('call:final', handleAnswerReceived);
      socket.off('call:declined', handleCallDeclined);
      socket.off('peer:nego:offer', handleNegotiationOffer);
      socket.off('peer:nego:final', handleNegotiationAnswer);
      socket.off('call:end', handleUserCallEnd);

    };
  }, [
    socket,
    handleUserJoin,
    handleOfferReceived,
    handleAnswerReceived,
    handleCallDeclined,
    handleNegotiationOffer,
    handleNegotiationAnswer,
    handleUserCallEnd
  ]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
    <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-white drop-shadow-lg">
      🎥 Video Call Room
    </h1>

    <div className="mb-6 text-lg flex items-center gap-2">
      <span className="font-semibold">Status:</span>
      {remoteSocketId ? (
        <span className="text-green-400 animate-pulse">Connected to {userDetails.name || "Peer"}</span>
      ) : (
        <span className="text-yellow-400 animate-pulse">Waiting for a peer...</span>
      )}
    </div>

    {remoteSocketId && (
      <button
        onClick={handleCall}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 rounded-full text-white font-medium text-lg shadow-lg hover:scale-105 transition-transform duration-300 mb-8"
      >
        📞 Call {userDetails.name || "Peer"}
      </button>
    )}
    {remoteStream && <button type='submit' onClick={handleEndCall}>End Call</button>}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
      {/* Local Video */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-white">📷 You</h2>
        {localStream ? (
          <ReactPlayer 
            url={localStream}
            // ref={(video) => video && (video.srcObject = localStream)}
            height="500px"
            width="500px"
            // autoPlay
            playing
            muted
            className="rounded-xl shadow-inner local-video"
          />
        ) : (
          <p className="text-gray-300">Loading local stream...</p>
        )}
      </div>

      {/* Remote Video */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-2xl font-semibold mb-4 text-white">🧑 {userDetails.name}</h2>
        {remoteStream ? (
          <ReactPlayer
            url={remoteStream}
            height="500px"
            width="500px"
            // ref={(video) => video && (video.srcObject = remoteStream)}
            // autoPlay
            playing
            className="rounded-xl shadow-inner remote-video"
          />
        ) : (
          <p className="text-gray-400 italic">No remote stream yet.</p>
        )}
      </div>
    </div>
  </div>
);

}

export default Room;
