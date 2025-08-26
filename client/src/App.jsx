import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Lobby from './pages/Lobby'
import './App.css'
import Room from './pages/Room'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PageNotFound from './pages/PageNotFound'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={"dashboard"} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={< PageNotFound />} />
      </Routes>
  )
}

export default App
