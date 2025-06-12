import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Lobby from './pages/Lobby/'
import './App.css'
import Room from './pages/Room'

function App() {
  return (
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  )
}

export default App
